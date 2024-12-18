<script lang="ts">
    import { Connection } from "@solana/web3.js";
    import type { Commitment, ConnectionConfig } from "@solana/web3.js";
    import { workspaceStore } from "$lib/stores/workspace-store";
    import { web3, Program, AnchorProvider } from "@coral-xyz/anchor";
    import {
        walletStore,
        type WalletStore,
    } from "@svelte-on-solana/wallet-adapter-core";
    import idl from "$lib/idl/little_homie.json";

    export let network: string,
        config: Commitment | ConnectionConfig | undefined = "processed";

    const baseAccount = web3.Keypair.generate();
    const systemProgram = web3.SystemProgram;
    const connection = new Connection(network, config);

    function defineProgramAndProvider(walletStore: WalletStore) {
        let {
            sendTransaction,
            signTransaction,
            signAllTransactions,
            signMessage,
            publicKey,
        } = walletStore;

        const providerWallet = {
            sendTransaction,
            signTransaction,
            signAllTransactions,
            signMessage,
            publicKey,
        };

        // @ts-ignore
        const provider = new AnchorProvider(connection, providerWallet, {
            preflightCommitment: "processed",
        } as web3.ConfirmOptions);

        const program = new Program(JSON.parse(JSON.stringify(idl)), provider);
        workspaceStore.set({
            baseAccount,
            connection,
            provider,
            program,
            systemProgram,
            network,
        });

        return {
            baseAccount,
            connection,
            provider,
            program,
            systemProgram,
            network,
        };
    }

    $: $walletStore &&
        $walletStore.publicKey &&
        defineProgramAndProvider($walletStore);
</script>

<slot />
