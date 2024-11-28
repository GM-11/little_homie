use anchor_lang::{prelude::*, solana_program::native_token::LAMPORTS_PER_SOL};
use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{
        create_master_edition_v3, create_metadata_accounts_v3, mpl_token_metadata::types::DataV2,
        CreateMasterEditionV3, CreateMetadataAccountsV3, Metadata,
    },
    token_2022::{mint_to, MintTo},
    token_interface::{Mint, TokenAccount, TokenInterface},
};

#[derive(Accounts)]
pub struct InitCoin<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        payer = payer,
        mint::decimals = 9,
        mint::authority = payer.key(),
        mint::freeze_authority = payer.key()
    )]
    pub coin_mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        init,
        payer = payer,
        associated_token::mint = coin_mint,
        associated_token::authority = payer,
    )]
    pub coin_token_account: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(mut)]
    pub metadata: SystemAccount<'info>,
    #[account(mut)]
    pub master_edition: SystemAccount<'info>,

    pub metadata_program: Program<'info, Metadata>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    pub token_program: Interface<'info, TokenInterface>,
}

impl<'info> InitCoin<'info> {
    pub fn init_coin(&mut self, name: String, symbol: String, uri: String) -> Result<()> {
        let mint_cpi_program = self.token_program.to_account_info();
        let mint_accounts = MintTo {
            mint: self.coin_mint.to_account_info(),
            to: self.coin_token_account.to_account_info(),
            authority: self.payer.to_account_info(),
        };
        mint_to(
            CpiContext::new(mint_cpi_program, mint_accounts),
            1 * LAMPORTS_PER_SOL,
        )?;

        let metadata_cpi_program = self.metadata_program.to_account_info();
        let metadata_accounts = CreateMetadataAccountsV3 {
            metadata: self.metadata.to_account_info(),
            mint: self.coin_mint.to_account_info(),
            mint_authority: self.payer.to_account_info(),
            payer: self.payer.to_account_info(),
            update_authority: self.payer.to_account_info(),
            system_program: self.system_program.to_account_info(),
            rent: self.rent.to_account_info(),
        };

        let data = DataV2 {
            name,
            symbol,
            uri,
            seller_fee_basis_points: 0,
            creators: None,
            collection: None,
            uses: None,
        };

        create_metadata_accounts_v3(
            CpiContext::new(metadata_cpi_program, metadata_accounts),
            data,
            true,
            true,
            None,
        )?;
        Ok(())
    }
}
