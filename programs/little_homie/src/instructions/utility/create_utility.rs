use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount};

use crate::{error::LittleHomieError, Utility, UTILITY_SEED};

#[derive(Accounts)]
pub struct CreateUtility<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(mut)]
    pub mint: InterfaceAccount<'info, Mint>,

    #[account(
        init,
        payer = payer,
        space = 8 + Utility::INIT_SPACE,
        seeds = [UTILITY_SEED.as_bytes().as_ref(), mint.key().as_ref()],
        bump
    )]
    pub utility: Box<Account<'info, Utility>>,

    #[account(
        mut,
        constraint = payer_mint_ata.mint == mint.key(),
    )]
    pub payer_mint_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    pub system_program: Program<'info, System>,
}

impl<'info> CreateUtility<'info> {
    pub fn create_utility(
        &mut self,
        name: String,
        description: String,
        min_amount: u64,
    ) -> Result<()> {
        require!(
            self.payer_mint_ata.amount > 10u64.pow(self.mint.decimals as u32),
            LittleHomieError::NotEnoughAmount
        );
        self.utility.set_inner(Utility {
            mint: self.mint.key(),
            name,
            description,
            min_amount,
        });
        Ok(())
    }
}
