pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("D2Vi2g5mVdhS5XmR9UfKxrZfyu1RuxTSKcZMKsQmyURP");

#[program]
pub mod little_homie {
    use super::*;

    pub fn init_coin(
        ctx: Context<InitCoin>,
        name: String,
        symbol: String,
        uri: String,
    ) -> Result<()> {
        ctx.accounts.init_coin(name, symbol, uri)
    }
}
