module seahare::pk;

use std::string::String;
use sui::clock::Clock;
use sui::coin::Coin;
use sui::event;
use sui::random::Random;
use seahare::seahare::{Profit, SEAHARE};

const Voting_Duration: u64 = 1000 * 60 * 60 * 24 * 3;

const E_Already_Exist: u64 = 0;
const E_Not_Enough_Players: u64 = 1;
const E_Not_Correct_Coin_Type: u64 = 2;
const E_Already_End: u64 = 3;

public struct List has key {
    id: UID,
    types: vector<String>
}

public struct VotingInfo has copy, drop, store {
    coin_type: String,
    supporters: u64
}

public struct PKInfo has key {
    id: UID,
    player1: VotingInfo,
    player2: VotingInfo,
    end_time: u64
}

public struct NewPKInfo has copy, drop {
    id: ID
}

fun init(ctx: &mut TxContext) {
    transfer::share_object(List {
        id: object::new(ctx),
        types: vector<String>[]
    });
}

public fun add_coin_type(list: &mut List, coin_type: String) {
    assert!(!list.types.contains(&coin_type), E_Already_Exist);
    list.types.push_back(coin_type);
}

entry fun random_opponent(list: &List, player1: String, clock: &Clock, random: &Random, ctx: &mut TxContext) {
    assert!(list.types.length() > 1, E_Not_Enough_Players);
    let mut player2 = player1;
    let mut generator = random.new_generator(ctx);
    while (true) {
        let idx = generator.generate_u64_in_range(0, list.types.length() - 1);
        player2 = list.types[idx];
        if (player1 != player2) {
            break
        };
    };
    let uid = object::new(ctx);
    let id = uid.to_inner();
    transfer::share_object(PKInfo {
        id: uid,
        player1: VotingInfo {
            coin_type: player1,
            supporters: 0
        },
        player2: VotingInfo {
            coin_type: player2,
            supporters: 0
        },
        end_time: clock.timestamp_ms() + Voting_Duration
    });
    event::emit(NewPKInfo {
        id
    });
}

public fun vote(info: &mut PKInfo, coin_type: String, profit: &mut Profit, coin: Coin<SEAHARE>, clock: &Clock) {
    assert!(info.player1.coin_type == coin_type || info.player2.coin_type == coin_type, E_Not_Correct_Coin_Type);
    assert!(info.end_time >= clock.timestamp_ms(), E_Already_End);
    let voting_info = if (info.player1.coin_type == coin_type) &mut info.player1 else &mut info.player2;
    voting_info.supporters = voting_info.supporters + coin.value();
    profit.add_profit(coin);
}