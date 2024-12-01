use anchor_lang::prelude::*;

#[error_code]
pub enum LittleHomieError {
    #[msg("Constant value must be greater than 0")]
    InvalidConstant,

    #[msg("Initial Supply must be greater than 0")]
    InvalidInitialSupply,

    #[msg("Name should be between 15 and 5 characters")]
    InvalidName,

    #[msg("Description should be between 40 and 5 characters")]
    InvalidDescription,

    #[msg("You are not authorized because do not have enough amount of this token")]
    NotEnoughAmount,
}
