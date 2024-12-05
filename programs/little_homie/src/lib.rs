pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::coin::*;
pub use instructions::dao::*;
pub use state::*;

declare_id!("9c7uYeTk5ME5LAMszEwXR3v7wfApX8yKRCDAUX2vF1yW");

#[program]
pub mod little_homie {
    use super::*;

    pub fn init_coin(
        ctx: Context<InitCoin>,
        name: String,
        symbol: String,
        uri: String,
        amount_for_user: u64,
        constant: u64,
        base_price_in_lamports: u64,
        stable_coin: Option<Pubkey>,
    ) -> Result<()> {
        ctx.accounts
            .init_state(constant, base_price_in_lamports, stable_coin, &ctx.bumps)?;
        ctx.accounts.transfer_lamports(base_price_in_lamports)?;
        ctx.accounts.mint_to_user(amount_for_user)?;
        ctx.accounts.init_coin(name, symbol, uri)
    }

    pub fn buy_coin(ctx: Context<BuyCoin>, amount_to_mint: u64) -> Result<()> {
        ctx.accounts.transfer_lamports(amount_to_mint)?;
        ctx.accounts.buy_coin(amount_to_mint)
    }

    pub fn sell_coin(ctx: Context<SellCoin>, amount: u64) -> Result<()> {
        ctx.accounts.sell_coin(amount)
    }
}
