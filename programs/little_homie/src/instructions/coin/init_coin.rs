use anchor_lang::{
    prelude::*,
    solana_program::native_token::LAMPORTS_PER_SOL,
    system_program::{transfer, Transfer},
};
use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{
        mpl_token_metadata::{instructions::CreateV1CpiBuilder, types::TokenStandard},
        Metadata,
    },
    token_2022::{mint_to, MintTo},
    token_interface::{Mint, TokenAccount, TokenInterface},
};

use crate::{error::LittleHomieError, CoinState, COIN_STATE_SEED};

#[derive(Accounts)]
pub struct InitCoin<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        payer = payer,
        mint::decimals = 9,
        mint::authority = coin_state,
        mint::freeze_authority = coin_state
    )]
    pub coin_mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        init,
        payer = payer,
        associated_token::mint = coin_mint,
        associated_token::authority = payer,
    )]
    pub user_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(mut)]
    pub metadata: SystemAccount<'info>,

    #[account(
        init,
        payer = payer,
        space = 8 + CoinState::INIT_SPACE,
        seeds = [COIN_STATE_SEED.as_bytes().as_ref(), coin_mint.key().as_ref()],
        bump
    )]
    pub coin_state: Box<Account<'info, CoinState>>,

    pub metadata_program: Program<'info, Metadata>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    pub token_program: Interface<'info, TokenInterface>,
}

impl<'info> InitCoin<'info> {
    #[inline(never)]
    pub fn init_state(
        &mut self,
        constant: u64,
        base_price_in_lamports: u64,
        stable_coin: Option<Pubkey>,
        bumps: &InitCoinBumps,
    ) -> Result<()> {
        require!(constant > 0, LittleHomieError::InvalidConstant);

        self.coin_state.set_inner(CoinState {
            stable_coin,
            constant,
            mint: self.coin_mint.key(),
            base_price_in_lamports,
            bump: bumps.coin_state,
        });
        Ok(())
    }

    pub fn transfer_lamports(&mut self, base_price_in_lamports: u64) -> Result<()> {
        msg!("Transferring SOL");
        let cpi_accounts = Transfer {
            from: self.payer.to_account_info(),
            to: self.coin_state.to_account_info(),
        };

        let cpi_context = CpiContext::new(self.system_program.to_account_info(), cpi_accounts);

        transfer(
            cpi_context,
            (base_price_in_lamports)
                .checked_mul(LAMPORTS_PER_SOL)
                .unwrap(),
        )?;
        Ok(())
    }

    pub fn mint_to_user(&mut self, amount_for_user: u64) -> Result<()> {
        msg!("Minting to user");

        let mint_accounts_user = MintTo {
            mint: self.coin_mint.to_account_info(),
            to: self.user_ata.to_account_info(),
            authority: self.coin_state.to_account_info(),
        };

        let seeds = &[
            COIN_STATE_SEED.as_bytes().as_ref(),
            &self.coin_mint.key().to_bytes()[..],
            &[self.coin_state.bump],
        ];
        let signer_seeds = &[&seeds[..]];

        let mint_cpi_user = CpiContext::new_with_signer(
            self.token_program.to_account_info(),
            mint_accounts_user,
            signer_seeds,
        );

        mint_to(
            mint_cpi_user,
            amount_for_user.checked_mul(LAMPORTS_PER_SOL).unwrap(),
        )
    }
    pub fn init_coin(&mut self, name: String, symbol: String, uri: String) -> Result<()> {
        msg!("init the token");

        let seeds = &[
            COIN_STATE_SEED.as_bytes().as_ref(),
            &self.coin_mint.key().to_bytes()[..],
            &[self.coin_state.bump],
        ];
        let signer_seeds = &[&seeds[..]];

        CreateV1CpiBuilder::new(&self.metadata_program.to_account_info())
            .name(name)
            .uri(uri)
            .symbol(symbol)
            .decimals(9)
            .metadata(&self.metadata.to_account_info())
            .mint(&self.coin_mint.to_account_info(), false)
            .authority(&self.coin_state.to_account_info())
            .update_authority(&self.coin_state.to_account_info(), true)
            .payer(&self.payer.to_account_info())
            .seller_fee_basis_points(0)
            .system_program(&self.system_program.to_account_info())
            .sysvar_instructions(&self.rent.to_account_info())
            .token_standard(TokenStandard::Fungible)
            .invoke_signed(signer_seeds)?;

        Ok(())
    }
}
