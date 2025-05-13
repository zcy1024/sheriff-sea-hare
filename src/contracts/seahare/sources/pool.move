module seahare::pool;

use sui::balance::Balance;
use sui::coin::Coin;
use sui::package::Publisher;

public struct Pool<phantom CoinA, phantom CoinB> has key {
    id: UID,
    a: Balance<CoinA>,
    b: Balance<CoinB>
}

public(package) fun inner_create_pool<CoinA, CoinB>(a: Coin<CoinA>, b: Coin<CoinB>, ctx: &mut TxContext) {
    transfer::share_object(Pool<CoinA, CoinB> {
        id: object::new(ctx),
        a: a.into_balance(),
        b: b.into_balance(),
    });
}

public fun create_pool<CoinA, CoinB>(_: &Publisher, a: Coin<CoinA>, b: Coin<CoinB>, ctx: &mut TxContext) {
    inner_create_pool<CoinA, CoinB>(a, b, ctx);
}

#[allow(lint(self_transfer))]
fun deal_with_balance<Coin>(balance: Balance<Coin>, ctx: &mut TxContext) {
    if (balance.value() == 0) {
        balance.destroy_zero();
    } else {
        transfer::public_transfer(balance.into_coin(ctx), ctx.sender());
    };
}

public fun burn_pool<CoinA, CoinB>(_: &Publisher, pool: Pool<CoinA, CoinB>, ctx: &mut TxContext) {
    let Pool<CoinA, CoinB> {
        id,
        a,
        b,
    } = pool;
    object::delete(id);
    deal_with_balance<CoinA>(a, ctx);
    deal_with_balance<CoinB>(b, ctx);
}

#[allow(lint(self_transfer))]
public fun swap_a_to_b<CoinA, CoinB>(pool: &mut Pool<CoinA, CoinB>, in: Coin<CoinA>, ctx: &mut TxContext) {
    let k = pool.a.value() * pool.b.value();
    pool.a.join(in.into_balance());
    let split_amount = pool.b.value() - k / pool.a.value();
    transfer::public_transfer(pool.b.split(split_amount).into_coin(ctx), ctx.sender());
}

#[allow(lint(self_transfer))]
public fun swap_b_to_a<CoinA, CoinB>(pool: &mut Pool<CoinA, CoinB>, in: Coin<CoinB>, ctx: &mut TxContext) {
    let k = pool.a.value() * pool.b.value();
    pool.b.join(in.into_balance());
    let split_amount = pool.a.value() - k / pool.b.value();
    transfer::public_transfer(pool.a.split(split_amount).into_coin(ctx), ctx.sender());
}