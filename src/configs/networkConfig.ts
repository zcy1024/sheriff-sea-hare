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
            Profit: "",
            Pool: ""
        }
    },
    testnet: {
        url: getFullnodeUrl("testnet"),
        variables: {
            Package: "0xf0d5d7b59c66319aa4fb6fe5eddd6983f2a547b4589965cacf4d2f8f130ba674",
            Publisher: "0xb1b607d616ca16068f6fa9434fb244196e5557eed44ca32db9904df1e8a325eb",
            UpgradeCap: "0xfc3850b4cf903a78f32d87a2b904c76ac7c368207ee46744160e854922098547",
            TreasuryCap: "0xc984a9f252828e2bf0ede9bce73845336df05007fac097a65252e2138056c3b8",
            PKList: "0x2bd1047afdca9669fea6638d97fd2ea1dbae8a515047ac5e47b827b51a1e395e",
            Profit: "0xc78d93a0a7c3d710e7e79b30a778db6216a7c2fd66b49cc89b1b46126afe14d2",
            Pool: "0x121c3adfe7c870039b489ef4402caa167f403e61d99828435fb671f6c76790d2"
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