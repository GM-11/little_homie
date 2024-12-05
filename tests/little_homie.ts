import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MPL_TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import { getKeypairFromFile } from "@solana-developers/helpers";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { LittleHomie } from "../target/types/little_homie";
const isToken2022 = true;

const tokenProgram = isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID;

const name = "Homer";
const symbol = "HOMR";
const uri =
  "https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/nft.json";

describe("little_homie", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.LittleHomie as Program<LittleHomie>;

  const coinMint = anchor.web3.Keypair.generate();

  const mplID = new anchor.web3.PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID);

  const COIN_STATE_SEED = Buffer.from(
    program.idl.constants[0].value.toString().slice(1, -1)
  );
  const PROPOSAL_SEED = Buffer.from(
    program.idl.constants[1].value.toString().slice(1, -1)
  );
  const [metadata] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("metadata"), mplID.toBuffer(), coinMint.publicKey.toBuffer()],
    mplID
  );
  const SOL_USD_SWITCHBOARD_FEED = new anchor.web3.PublicKey(
    "GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR"
  );
  it("Init new coin", async () => {
    const wallet = await getKeypairFromFile("~/.config/solana/id.json");

    const [coinState] = anchor.web3.PublicKey.findProgramAddressSync(
      [COIN_STATE_SEED, coinMint.publicKey.toBuffer()],
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
          new anchor.BN(1),
          null
        )
        .accountsPartial({
          payer: wallet.publicKey,
          coinMint: coinMint.publicKey,
          userAta,
          coinState,
          metadata,
          tokenProgram,

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

  it("Buy coin from wallet 1", async () => {
    const wallet1 = await getKeypairFromFile("./wallets/wallet1.json");

    const [userAta] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        wallet1.publicKey.toBuffer(),
        tokenProgram.toBuffer(),
        coinMint.publicKey.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const [coinState] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("coin_state"), coinMint.publicKey.toBuffer()],
      program.programId
    );

    try {
      const tx = await program.methods
        .buyCoin(new anchor.BN(2))
        .accountsPartial({
          payer: wallet1.publicKey,
          coinMint: coinMint.publicKey,
          coinState,
          userAta,
          chainlinkProgram: new anchor.web3.PublicKey(
            "HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny"
          ),
          chainlinkFeed: new anchor.web3.PublicKey(
            "CH31Xns5z3M1cTAbKW34jcxPPciazARpijcHj9rxtemt"
          ),
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram,
        })
        .signers([wallet1])
        .rpc();

      console.log("Your transaction signature:", tx);
    } catch (e) {
      console.log(e);
    }
  });
});
