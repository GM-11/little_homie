use anchor_lang::{
    prelude::*,
    solana_program::native_token::LAMPORTS_PER_SOL,
    system_program::{transfer, Transfer},
};
use anchor_spl::{
    associated_token::AssociatedToken,
    token_2022::{mint_to, MintTo},
    token_interface::{Mint, TokenAccount, TokenInterface},
};

use crate::{CoinState, Decimal, COIN_STATE_SEED};

#[derive(Accounts)]
pub struct BuyCoin<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(mut)]
    pub coin_state: Box<Account<'info, CoinState>>,

    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = coin_mint,
        associated_token::authority = payer,
    )]
    pub user_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(mut)]
    pub coin_mint: Box<InterfaceAccount<'info, Mint>>,

    /// CHECK: We're reading data from this chainlink feed account
    pub chainlink_feed: AccountInfo<'info>,
    /// CHECK: This is the Chainlink program library
    pub chainlink_program: AccountInfo<'info>,

    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub token_program: Interface<'info, TokenInterface>,
}

impl<'info> BuyCoin<'info> {
    fn calculate_price(&self, amount_to_mint: u64, supply: u64) -> u64 {
        let mut total_price: u64 = 0;

        msg!("Total supply: {:?}", supply);
        msg!("Amount to mint: {:?}", amount_to_mint);

        let supply_temp = supply.checked_div(LAMPORTS_PER_SOL).unwrap();
        let base_price = self
            .coin_state
            .base_price_in_lamports
            .checked_div(LAMPORTS_PER_SOL)
            .unwrap();

        for i in 0..amount_to_mint {
            let price = base_price
                .checked_add(
                    supply_temp
                        .checked_add(i)
                        .unwrap()
                        .checked_mul(self.coin_state.constant)
                        .unwrap(),
                )
                .unwrap();
            total_price = total_price.checked_add(price).unwrap();
        }

        msg!("total price: {:?}", total_price.clone());

        total_price.checked_mul(LAMPORTS_PER_SOL).unwrap()
    }

    pub fn transfer_lamports(&mut self, amount_to_mint: u64) -> Result<()> {
        msg!("Transferring SOL");

        let amount_to_transfer: u64;
        match self.coin_state.stable_coin {
            Some(stable_coin) => {
                let round = chainlink_solana::latest_round_data(
                    self.chainlink_program.to_account_info(),
                    self.chainlink_feed.to_account_info(),
                )?;

                let decimals = chainlink_solana::decimals(
                    self.chainlink_program.to_account_info(),
                    self.chainlink_feed.to_account_info(),
                )?;

                msg!("{}", stable_coin);

                let price = Decimal::new(round.answer, decimals as u32);
                let sol_in_usd = price.to_u64();

                amount_to_transfer = sol_in_usd;
            }
            None => {
                amount_to_transfer = self.calculate_price(amount_to_mint, self.coin_mint.supply)
            }
        }

        let cpi_accounts = Transfer {
            from: self.payer.to_account_info(),
            to: self.coin_state.to_account_info(),
        };

        let cpi_context = CpiContext::new(self.system_program.to_account_info(), cpi_accounts);

        transfer(cpi_context, amount_to_transfer)?;
        Ok(())
    }

    pub fn buy_coin(&mut self, amount_to_mint: u64) -> Result<()> {
        msg!("Minting coin");

        let cpi_accounts = MintTo {
            mint: self.coin_mint.to_account_info(),
            to: self.user_ata.to_account_info(),
            authority: self.coin_state.to_account_info(),
        };

        let seeds = &[
            COIN_STATE_SEED.as_bytes().as_ref(),
            &self.coin_mint.key().to_bytes()[..],
            &[self.coin_state.bump],
        ];
        let signer_seeds = &[&seeds[..]];

        let cpi_context = CpiContext::new_with_signer(
            self.token_program.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );

        mint_to(
            cpi_context,
            amount_to_mint.checked_mul(LAMPORTS_PER_SOL).unwrap(),
        )?;

        // self.coin_mint.

        Ok(())
    }
}
