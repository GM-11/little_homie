<script lang="ts">
    import { onMount } from "svelte";
    import { WalletProvider } from "@svelte-on-solana/wallet-adapter-ui";
    import "@coral-xyz/anchor";

    let idl = {};

    import AnchorConnectionProvider from "$lib/components/wallet/AnchorConnectionProvider.svelte";
    import { clusterApiUrl } from "@solana/web3.js";

    const localStorageKey = "walletAdapter";
    const network = clusterApiUrl("devnet"); // localhost or mainnet
    let wallets: any[];

    onMount(async () => {
        const { PhantomWalletAdapter, SolflareWalletAdapter } = await import(
            "@solana/wallet-adapter-wallets"
        );

        const walletsMap = [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
        ];

        wallets = walletsMap;
    });
</script>

<WalletProvider {localStorageKey} {wallets} autoConnect />
<AnchorConnectionProvider {network} {idl} />

<slot />

<style>

    :global(body, h1, h2, h3, h4, h5, h6, p) {
           margin: 0;
           padding: 0;
    }
</style>
