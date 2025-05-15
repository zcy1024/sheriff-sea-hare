import dotenv from "dotenv";
import {coinWithBalance, Transaction} from "@mysten/sui/transactions";
import {Ed25519Keypair} from "@mysten/sui/keypairs/ed25519";
import {getFullnodeUrl, SuiClient} from "@mysten/sui/client";

dotenv.config();

const Package = "0x28b4d7cfccd20c445f851dacaf44d9a56cd6cbf702f906500aadfe644e45bf32";
const Publisher = "0x662eae353a56f4e24b9b021471ef9b926ae64a6fa4736c031fde53e420592ec4";
const TreasuryCap = "0x663a69c40416b59ed42574e87411e192fd83dbf7e8749215548fbbe06f3b3ab5";

const suiClient = new SuiClient({url: getFullnodeUrl("testnet")});
const keypair = Ed25519Keypair.fromSecretKey(process.env.SECRETKEY!);

async function main() {
    const tx = new Transaction();
    const [seahare] = tx.moveCall({
        target: `${Package}::seahare::mint`,
        arguments: [
            tx.object(TreasuryCap),
            tx.pure.u64(2000 * 10 ** 9)
        ]
    });
    tx.moveCall({
        target: `${Package}::pool::create_pool`,
        typeArguments: [
            "0x2::sui::SUI",
            `${Package}::seahare::SEAHARE`
        ],
        arguments: [
            tx.object(Publisher),
            coinWithBalance({
                balance: 20 * 10 ** 9
            }),
            seahare
        ]
    });
    const res = await suiClient.signAndExecuteTransaction({
        transaction: tx,
        signer: keypair,
        options: {
            showEffects: true,
            showObjectChanges: true
        }
    });
    await suiClient.waitForTransaction({
        digest: res.digest
    });
    const pool = res.objectChanges?.find(obj => obj.type === "created");
    console.log(pool!.objectId);
    console.log(pool!.objectType);
    // console.log(res.objectChanges);
}

main().then();