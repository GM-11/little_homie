import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MPL_TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import { getKeypairFromFile } from "@solana-developers/helpers";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { LittleHomie } from "../target/types/little_homie";

const name = "Homer NFT";
const symbol = "HOMR";
const uri =
  "https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/nft.json";

describe("little_homie", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.LittleHomie as Program<LittleHomie>;

  const coinMint = anchor.web3.Keypair.generate();

  const mplID = new anchor.web3.PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID);

  const [metadata] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("metadata"), mplID.toBuffer(), coinMint.publicKey.toBuffer()],
    mplID
  );
  const [masterEdition] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      mplID.toBuffer(),
      coinMint.publicKey.toBuffer(),
      Buffer.from("edition"),
    ],
    mplID
  );

  it("Init new coin", async () => {
    const wallet = await getKeypairFromFile("~/.config/solana/id.json");

    const [coinTokenAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        wallet.publicKey.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        coinMint.publicKey.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const tx = await program.methods
      .initCoin(name, symbol, uri)
      .accountsPartial({
        payer: wallet.publicKey,
        coinMint: coinMint.publicKey,
        coinTokenAccount,
        metadata,
        masterEdition,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        metadataProgram: mplID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([wallet, coinMint])
      .rpc();
    console.log("Your transaction signature", tx);
    console.log("Coin Mint", coinMint.publicKey.toBase58());
  });
});
