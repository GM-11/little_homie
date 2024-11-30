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

const isToken2022 = true;

const tokenProgram = isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID;

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

  it("Init new coin", async () => {
    const wallet = await getKeypairFromFile("~/.config/solana/id.json");

    const [coinState] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("coin_state"), coinMint.publicKey.toBuffer()],
      program.programId
    );

    const [coinStateAta] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        coinState.toBuffer(),
        tokenProgram.toBuffer(),
        coinMint.publicKey.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const [userAta] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        wallet.publicKey.toBuffer(),
        tokenProgram.toBuffer(),
        coinMint.publicKey.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    try {
      const tx = await program.methods
        .initCoin(
          name,
          symbol,
          uri,
          new anchor.BN(100),
          new anchor.BN(1),
          new anchor.BN(1)
        )
        .accountsPartial({
          payer: wallet.publicKey,
          coinMint: coinMint.publicKey,
          userAta,
          coinState,
          metadata,
          tokenProgram,
          // coinStateAta,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          metadataProgram: mplID,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([wallet, coinMint])
        .rpc();
      console.log("Your transaction signature:", tx);
      console.log("Coin Mint:", coinMint.publicKey.toBase58());
      console.log("Coin State Account:", coinState.toBase58());
    } catch (e) {
      console.log("Coin Mint:", coinMint.publicKey.toBase58());
      console.log("Coin State Account:", coinState.toBase58());
      console.log("User ATA:", userAta.toBase58());

      console.log(e);
    }
  });

  // it("Buy coin from wallet 1", async () => {
  //   const wallet1 = await getKeypairFromFile("./wallets/wallet1.json");

  //   const [coinTokenAccount] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [
  //       wallet1.publicKey.toBuffer(),
  //       tokenProgram.toBuffer(),
  //       coinMint.publicKey.toBuffer(),
  //     ],
  //     ASSOCIATED_TOKEN_PROGRAM_ID
  //   );

  //   const [coinState] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [Buffer.from("coin_state"), coinMint.publicKey.toBuffer()],
  //     program.programId
  //   );

  //   const tx = await program.methods
  //     .buyCoin(new anchor.BN(2))
  //     .accountsPartial({
  //       payer: wallet1.publicKey,
  //       coinMint: coinMint.publicKey,
  //       coinState,
  //       coinTokenAccount,
  //       associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
  //       systemProgram: anchor.web3.SystemProgram.programId,
  //       tokenProgram,
  //     })
  //     .signers([wallet1])
  //     .rpc();

  //   console.log("Your transaction signature:", tx);
  // });
});
