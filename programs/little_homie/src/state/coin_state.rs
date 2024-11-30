use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct CoinState {
    pub constant: u64,
    pub base_price_in_lamports: u64,
    pub num_holders: u64,
    pub bump: u8,
}
