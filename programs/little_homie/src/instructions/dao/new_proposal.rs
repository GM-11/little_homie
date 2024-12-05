use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount};

use crate::{error::LittleHomieError, Proposal, ProposalType, PROPOSAL_SEED};

#[derive(Accounts)]
pub struct NewProposal<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        payer = payer,
        space = 8 + Proposal::INIT_SPACE,
        seeds = [PROPOSAL_SEED.as_bytes().as_ref(), payer.key().as_ref(), coin_mint.key().as_ref()],
        bump
    )]
    pub proposal: Box<Account<'info, Proposal>>,

    #[account(mut)]
    pub coin_mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(mut)]
    pub payer_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    pub system_program: Program<'info, System>,
}

impl<'info> NewProposal<'info> {
    pub fn init_proposal(
        &mut self,
        name: String,
        description: String,
        proposal_type: ProposalType,
    ) -> Result<()> {
        msg!("Initializing proposal");
        require!(
            name.len() > 15 || name.len() < 5,
            LittleHomieError::InvalidName
        );
        require!(
            description.len() > 40 || description.len() < 5,
            LittleHomieError::InvalidDescription
        );

        require!(self.payer_ata.amount > 0, LittleHomieError::NotEnoughAmount);

        self.proposal.set_inner(Proposal {
            coin_mint: self.coin_mint.key(),
            name,
            description,
            implemented: false,
            proposal_type,
            bump: self.proposal.bump,
        });
        Ok(())
    }
}
