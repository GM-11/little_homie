use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct CoinState {
    pub constant: u64,
    #[max_len(5)]
    pub stable_coin: Option<String>,
    pub base_price_in_lamports: u64,
    pub bump: u8,
}
