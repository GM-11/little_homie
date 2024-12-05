use anchor_lang::prelude::*;

use crate::{CoinState, Proposal, ProposalType};

#[derive(Accounts)]
pub struct ImplementProposal<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(mut)]
    pub coin_state: Box<Account<'info, CoinState>>,

    #[account(mut)]
    pub proposal: Box<Account<'info, Proposal>>,
}

impl<'info> ImplementProposal<'info> {
    fn peg(&mut self, stable_coin: Pubkey) -> Result<()> {
        msg!("Pegging with {:?}", stable_coin);
        self.coin_state.stable_coin = Some(stable_coin);
        Ok(())
    }

    fn unpeg(&mut self) -> Result<()> {
        msg!("Unpegging");
        self.coin_state.stable_coin = None;
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
            ProposalType::Peg(stable_coin) => self.peg(stable_coin),
            ProposalType::FreezeMint => self.freeze_mint(),
            ProposalType::Unpeg => self.unpeg(),
        }?;
        self.proposal.implemented = true;
        Ok(())
    }
}
