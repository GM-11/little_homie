use anchor_lang::{
    prelude::*,
    solana_program::native_token::LAMPORTS_PER_SOL,
    system_program::{transfer, Transfer},
};
use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::Metadata,
    token_2022::{burn, Burn},
    token_interface::{Mint, TokenAccount, TokenInterface},
};

use crate::{CoinState, COIN_STATE_SEED};

#[derive(Accounts)]
pub struct SellCoin<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        mut,
        seeds = [COIN_STATE_SEED.as_bytes().as_ref(), coin_mint.key().as_ref()],
        bump = coin_state.bump
    )]
    pub coin_state: Box<Account<'info, CoinState>>,

    #[account(
        mut,
        associated_token::mint = coin_mint,
        associated_token::authority = coin_state,
    )]
    pub coin_token_account: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(mut)]
    pub coin_mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(mut)]
    pub metadata: SystemAccount<'info>,

    #[account(
        mut,
        associated_token::mint = coin_mint,
        associated_token::authority = payer,
    )]
    pub payer_token_account: Box<InterfaceAccount<'info, TokenAccount>>,

    pub metadata_program: Program<'info, Metadata>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub token_program: Interface<'info, TokenInterface>,
}

impl<'info> SellCoin<'info> {
    fn calculate_price(&self, amount_to_sell: u64, supply: u64) -> u64 {
        let mut total_price: u64 = 0;

        for i in 1..amount_to_sell {
            let price = self
                .coin_state
                .base_price_in_lamports
                .checked_add(
                    supply
                        .checked_sub(i)
                        .unwrap()
                        .checked_mul(self.coin_state.constant)
                        .unwrap(),
                )
                .unwrap();
            total_price = total_price.checked_add(price).unwrap();
        }

        total_price
    }

    pub fn sell_coin(&mut self, sell_amount: u64) -> Result<()> {
        msg!("Burn coins");
        let cpi_accounts = Burn {
            mint: self.coin_mint.to_account_info(),
            from: self.coin_token_account.to_account_info(),
            authority: self.payer.to_account_info(),
        };

        let cpi_context = CpiContext::new(self.token_program.to_account_info(), cpi_accounts);

        burn(cpi_context, sell_amount)?;

        Ok(())
    }

    pub fn transfer_sol(&mut self, amount_to_sell: u64) -> Result<()> {
        msg!("Transferring SOL");

        // get supply of a token mint

        let amount_to_transfer = self.calculate_price(amount_to_sell, self.coin_mint.supply);

        let seeds = &[
            COIN_STATE_SEED.as_bytes().as_ref(),
            &self.coin_mint.key().to_bytes()[..],
            &[self.coin_state.bump],
        ];
        let signer_seeds = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: self.coin_state.to_account_info(),
            to: self.payer.to_account_info(),
        };

        let cpi_context = CpiContext::new_with_signer(
            self.system_program.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );

        transfer(
            cpi_context,
            amount_to_transfer.checked_mul(LAMPORTS_PER_SOL).unwrap(),
        )?;
        Ok(())
    }
}
