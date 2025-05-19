// import dotenv from "dotenv";
// import {coinWithBalance, Transaction} from "@mysten/sui/transactions";
// import {Ed25519Keypair} from "@mysten/sui/keypairs/ed25519";
// import {getFullnodeUrl, SuiClient} from "@mysten/sui/client";
//
// dotenv.config();
//
// const Package = "0xf0d5d7b59c66319aa4fb6fe5eddd6983f2a547b4589965cacf4d2f8f130ba674";
// const Publisher = "0xb1b607d616ca16068f6fa9434fb244196e5557eed44ca32db9904df1e8a325eb";
// const TreasuryCap = "0xc984a9f252828e2bf0ede9bce73845336df05007fac097a65252e2138056c3b8";
// const Pool = "0x121c3adfe7c870039b489ef4402caa167f403e61d99828435fb671f6c76790d2";
//
// const suiClient = new SuiClient({url: getFullnodeUrl("testnet")});
// const keypair = Ed25519Keypair.fromSecretKey(process.env.SECRETKEY!);
//
// async function create() {
//     const tx = new Transaction();
//     const [seahare] = tx.moveCall({
//         target: `${Package}::seahare::mint`,
//         arguments: [
//             tx.object(TreasuryCap),
//             tx.pure.u64(2000 * 10 ** 9)
//         ]
//     });
//     tx.moveCall({
//         target: `${Package}::pool::create_pool`,
//         typeArguments: [
//             "0x2::sui::SUI",
//             `${Package}::seahare::SEAHARE`
//         ],
//         arguments: [
//             tx.object(Publisher),
//             coinWithBalance({
//                 balance: 20 * 10 ** 9
//             }),
//             seahare
//         ]
//     });
//     const res = await suiClient.signAndExecuteTransaction({
//         transaction: tx,
//         signer: keypair,
//         options: {
//             showEffects: true,
//             showObjectChanges: true
//         }
//     });
//     await suiClient.waitForTransaction({
//         digest: res.digest
//     });
//     const pool = res.objectChanges?.find(obj => obj.type === "created");
//     console.log(pool!.objectId);
//     console.log(pool!.objectType);
//     // console.log(res.objectChanges);
// }
//
// async function burn() {
//     const tx = new Transaction();
//     tx.moveCall({
//         target: `${Package}::pool::burn_pool`,
//         typeArguments: [
//             "0x2::sui::SUI",
//             `${Package}::seahare::SEAHARE`
//         ],
//         arguments: [
//             tx.object(Publisher),
//             tx.object(Pool)
//         ]
//     });
//     const res = await suiClient.signAndExecuteTransaction({
//         transaction: tx,
//         signer: keypair
//     });
//     await suiClient.waitForTransaction({
//         digest: res.digest
//     });
// }
//
// async function main() {
//     await create();
//     // await burn();
// }
//
// main().then();