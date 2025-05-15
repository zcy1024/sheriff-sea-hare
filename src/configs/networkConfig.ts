import {getFullnodeUrl, SuiClient} from "@mysten/sui/client";
import {createNetworkConfig} from "@mysten/dapp-kit";
import {Transaction} from "@mysten/sui/transactions";
import {BrowserPasskeyProvider, BrowserPasswordProviderOptions, PasskeyKeypair} from "@mysten/sui/keypairs/passkey";

type Network = "mainnet" | "testnet";

const network = (process.env.NEXT_PUBLIC_NETWORK as Network) || "testnet";

const {networkConfig, useNetworkVariable, useNetworkVariables} = createNetworkConfig({
    mainnet: {
        url: getFullnodeUrl("mainnet"),
        variables: {
            Package: "",
            Publisher: "",
            UpgradeCap: "",
            TreasuryCap: "",
            PKList: "",
            Profit: ""
        }
    },
    testnet: {
        url: getFullnodeUrl("testnet"),
        variables: {
            Package: "0x28b4d7cfccd20c445f851dacaf44d9a56cd6cbf702f906500aadfe644e45bf32",
            Publisher: "0x662eae353a56f4e24b9b021471ef9b926ae64a6fa4736c031fde53e420592ec4",
            UpgradeCap: "0x45dffd3addeb544d26d237a1e0a8f6ef266344a618a012887c30fc0d1111cc3a",
            TreasuryCap: "0x663a69c40416b59ed42574e87411e192fd83dbf7e8749215548fbbe06f3b3ab5",
            PKList: "0xc82d12030d972741b7a40a2844cbb9ecad6f5a75483b57b7fb575116ee35d63a",
            Profit: "0x077c25c31df9c22e7673a8fbbbbde28dfb721892e4b5fa30287396fd6fcd00b3"
        }
    }
});

const suiClient = new SuiClient({
    url: networkConfig[network].url
});

const passkeySavedName = "Sheriff SeaHare";
const authenticatorAttachment = "cross-platform";
let passkeyProvider: BrowserPasskeyProvider;
function getPasskeyProvider(rpId: string) {
    if (!passkeyProvider) {
        passkeyProvider = new BrowserPasskeyProvider(passkeySavedName, {
            rpName: passkeySavedName,
            rpId,
            authenticatorSelection: {
                authenticatorAttachment,
            },
        } as BrowserPasswordProviderOptions);
    }
    return passkeyProvider;
}

let keypair: PasskeyKeypair;
function getPasskeyKeypair(rpId: string, publicKeyStr: string) {
    if (keypair && keypair.getPublicKey().toRawBytes().toString() === publicKeyStr)
        return keypair;
    const publicKey = new Uint8Array(publicKeyStr.split(',').map(item => Number(item)));
    const passkeyProvider = getPasskeyProvider(rpId);
    keypair = new PasskeyKeypair(publicKey, passkeyProvider);
    return keypair;
}

type NetworkVariables = ReturnType<typeof useNetworkVariables>;

function getNetworkVariables() {
    return networkConfig[network].variables;
}

function createBetterTxFactory<T extends Record<string, unknown>>(
    fn: (tx: Transaction, networkVariables: NetworkVariables, params: T) => Transaction
) {
    return (params: T) => {
        const tx = new Transaction();
        const networkVariables = getNetworkVariables();
        return fn(tx, networkVariables, params);
    }
}

export type {NetworkVariables};
export {
    network,
    useNetworkVariable,
    useNetworkVariables,
    networkConfig,
    suiClient,
    createBetterTxFactory,
    getPasskeyProvider,
    getPasskeyKeypair,
}