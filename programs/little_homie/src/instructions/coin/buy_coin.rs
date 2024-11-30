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

use crate::{error::LittleHomieError, CoinState};

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

    #[account(
        mut,
        associated_token::mint = coin_mint,
        associated_token::authority = coin_state,
    )]
    pub coin_state_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(mut)]
    pub coin_mint: Box<InterfaceAccount<'info, Mint>>,

    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub token_program: Interface<'info, TokenInterface>,
}

impl<'info> BuyCoin<'info> {
    fn calculate_price(&self, amount_to_mint: u64, supply: u64) -> u64 {
        let mut total_price: u64 = 0;

        for i in 1..amount_to_mint {
            let price = self
                .coin_state
                .base_price_in_lamports
                .checked_add(
                    supply
                        .checked_add(i - 1)
                        .unwrap()
                        .checked_mul(self.coin_state.constant)
                        .unwrap(),
                )
                .unwrap();
            total_price = total_price.checked_add(price).unwrap();
        }

        total_price
    }

    pub fn transfer_lamports(&mut self, amount_to_mint: u64) -> Result<()> {
        msg!("Transferring SOL");

        let amount_to_transfer = self.calculate_price(amount_to_mint, self.coin_mint.supply);

        let cpi_accounts = Transfer {
            from: self.payer.to_account_info(),
            to: self.coin_state.to_account_info(),
        };

        let cpi_context = CpiContext::new(self.system_program.to_account_info(), cpi_accounts);

        transfer(
            cpi_context,
            amount_to_transfer.checked_mul(LAMPORTS_PER_SOL).unwrap(),
        )?;
        Ok(())
    }

    pub fn buy_coin(&mut self, amount_to_mint: u64) -> Result<()> {
        msg!("Minting coin");

        require!(
            self.coin_state_ata.amount > amount_to_mint,
            LittleHomieError::NotEnoughAmount
        );

        let cpi_accounts = MintTo {
            mint: self.coin_mint.to_account_info(),
            to: self.user_ata.to_account_info(),
            authority: self.coin_state.to_account_info(),
        };

        let seeds = &[
            b"coin_state".as_ref(),
            &self.coin_mint.key().to_bytes()[..],
            &[self.coin_state.bump],
        ];
        let signer_seeds = &[&seeds[..]];

        let cpi_context = CpiContext::new_with_signer(
            self.token_program.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );

        mint_to(cpi_context, amount_to_mint * LAMPORTS_PER_SOL)?;

        Ok(())
    }
}
