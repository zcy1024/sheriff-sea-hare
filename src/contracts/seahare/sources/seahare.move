module seahare::seahare;

use sui::balance::{Self, Balance};
use sui::coin::{Self, Coin, TreasuryCap};
use sui::package::Publisher;
use sui::url;

public struct SEAHARE has drop {}

public struct Profit has key {
    id: UID,
    profit: Balance<SEAHARE>
}

fun init(otw: SEAHARE, ctx: &mut TxContext) {
    let (treasury, metadata) = coin::create_currency(
        otw,
        9,
        b"SeaHare",
        b"SeaHare Coin",
        b"The Supreme Judge of Ocean Memes",
        option::some(url::new_unsafe_from_bytes(b"https://mainnet-aggregator.hoh.zone/v1/blobs/coyfvy-BN3DELR7eAXOQ2BkJeAWNmpalN8VKATPXbjo")),
        ctx
    );
    transfer::public_freeze_object(metadata);
    transfer::public_transfer(treasury, ctx.sender());
    transfer::share_object(Profit {
        id: object::new(ctx),
        profit: balance::zero()
    });
}

public fun mint(treasury: &mut TreasuryCap<SEAHARE>, amount: u64, ctx: &mut TxContext): Coin<SEAHARE> {
    coin::mint(treasury, amount, ctx)
}

public fun mint_and_keep(treasury: &mut TreasuryCap<SEAHARE>, amount: u64, recipient: address, ctx: &mut TxContext) {
    transfer::public_transfer(mint(treasury, amount, ctx), recipient);
}

public fun add_profit(profit: &mut Profit, coin: Coin<SEAHARE>) {
    profit.profit.join(coin.into_balance());
}

#[allow(lint(self_transfer))]
public fun withdraw(_: &Publisher, profit: &mut Profit, ctx: &mut TxContext) {
    transfer::public_transfer(profit.profit.withdraw_all().into_coin(ctx), ctx.sender());
}