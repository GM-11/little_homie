use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Proposal {
    pub coin_mint: Pubkey,
    #[max_len(15)]
    pub name: String,
    #[max_len(40)]
    pub description: String,
    pub implemented: bool,
    pub proposal_type: ProposalType,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, InitSpace)]
pub enum ProposalType {
    Peg(#[max_len(5)] String),
    Unpeg,
    FreezeMint,
}
