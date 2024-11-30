use anchor_lang::prelude::*;

use crate::{Proposal, ProposalType};

#[derive(Accounts)]
pub struct ImplementProposal<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(mut)]
    pub proposal: Box<Account<'info, Proposal>>,
}

impl<'info> ImplementProposal<'info> {
    fn peg_with_stable_coin(&mut self) -> Result<()> {
        msg!("Peg with stable coin");
        Ok(())
    }

    fn freeze_mint(&mut self) -> Result<()> {
        msg!("Freeze mint");
        // freeze mint for the mint self.proposal.coin_mint

        Ok(())
    }

    pub fn implement_proposal(&mut self) -> Result<()> {
        msg!("Implementing proposal");
        match self.proposal.proposal_type {
            ProposalType::PegWithStableCoin => self.peg_with_stable_coin(),
            ProposalType::FreezeMint => self.freeze_mint(),
        }?;
        self.proposal.implemented = true;
        Ok(())
    }
}
