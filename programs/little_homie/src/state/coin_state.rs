use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct CoinState {
    pub constant: u64,
    pub stable_coin: Option<Pubkey>,
    pub mint: Pubkey,
    pub base_price_in_lamports: u64,
    pub bump: u8,
}
