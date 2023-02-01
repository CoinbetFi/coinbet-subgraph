import { BigInt } from "@graphprotocol/graph-ts";
import {
  CoinbetSlotMachine,
  BetPlaced,
  BetRefunded,
  BetSettled,
  CoinbetTokenFeeWaiverThresholdUpdated,
  HousePoolUpdated,
  MaxBetAmountUpdated,
  MinBetAmountUpdated,
  OwnershipTransferred,
  Paused,
  ProtocolFeeUpdated,
  Unpaused,
} from "../generated/CoinbetSlotMachine/CoinbetSlotMachine";
import {
  BetPlacedEntity,
  BetSettledEntity,
  BetsStatisticsEntity,
  BetsStatisticsForAddressEntity,
} from "../generated/schema";

export function handleBetPlaced(event: BetPlaced): void {
  let id = event.params.requestId.toHex() + event.transaction.hash.toHex();
  let betPlacedEntity = new BetPlacedEntity(id);
  let contract = CoinbetSlotMachine.bind(event.address);

  betPlacedEntity.betAmount = event.params.betAmount;
  betPlacedEntity.requestId = event.params.requestId;
  betPlacedEntity.player = event.params.player;
  betPlacedEntity.timestamp = event.block.timestamp;

  // Handle players count
  let betsStatisticsEntity = BetsStatisticsEntity.load("0x1");

  if (!betsStatisticsEntity) {
    betsStatisticsEntity = new BetsStatisticsEntity("0x1");
    betsStatisticsEntity.playersCount = 0;
    betsStatisticsEntity.totalBets = 0;
    betsStatisticsEntity.totalBetsVolume = new BigInt(0);
    betsStatisticsEntity.totalRewardsVolume = new BigInt(0);
    betsStatisticsEntity.players = [];
  }

  let players = betsStatisticsEntity.players;

  if (!players.includes(event.params.player)) {
    players.push(event.params.player);
    betsStatisticsEntity.playersCount++;
    betsStatisticsEntity.players = players;
  }

  betsStatisticsEntity.totalBets++;
  betsStatisticsEntity.totalBetsVolume = betsStatisticsEntity.totalBetsVolume.plus(
    event.params.betAmount
  );

  // Handle bets count for player
  let betsStatisticsForAddressEntity = BetsStatisticsForAddressEntity.load(
    event.params.player.toHexString()
  );

  if (!betsStatisticsForAddressEntity) {
    betsStatisticsForAddressEntity = new BetsStatisticsForAddressEntity(
      event.params.player.toHexString()
    );
    betsStatisticsForAddressEntity.totalBets = 0;
    betsStatisticsForAddressEntity.totalBetsVolume = new BigInt(0);
    betsStatisticsForAddressEntity.totalRewardsVolume = new BigInt(0);
  }

  betsStatisticsForAddressEntity.totalBets++;
  betsStatisticsForAddressEntity.totalBetsVolume = betsStatisticsForAddressEntity.totalBetsVolume.plus(
    event.params.betAmount
  );

  // Save entities
  betPlacedEntity.save();
  betsStatisticsEntity.save();
  betsStatisticsForAddressEntity.save();
}

export function handleBetRefunded(event: BetRefunded): void {}

export function handleBetSettled(event: BetSettled): void {
  let id = event.params.requestId.toHex() + event.transaction.hash.toHex();
  let betSettledEntity = new BetSettledEntity(id);
  let contract = CoinbetSlotMachine.bind(event.address);

  betSettledEntity.first = event.params.firstReel;
  betSettledEntity.second = event.params.secondReel;
  betSettledEntity.third = event.params.thirdReel;
  betSettledEntity.reward = event.params.winAmount;
  betSettledEntity.requestId = event.params.requestId;
  betSettledEntity.player = event.params.player;
  betSettledEntity.timestamp = event.block.timestamp;

  // Handle rewards volume
  let betsStatisticsEntity = BetsStatisticsEntity.load("0x1");

  if (!betsStatisticsEntity) {
    betsStatisticsEntity = new BetsStatisticsEntity("0x1");
    betsStatisticsEntity.playersCount = 0;
    betsStatisticsEntity.totalBets = 0;
    betsStatisticsEntity.totalBetsVolume = new BigInt(0);
    betsStatisticsEntity.totalRewardsVolume = new BigInt(0);
    betsStatisticsEntity.players = [];
  }

  betsStatisticsEntity.totalRewardsVolume = betsStatisticsEntity.totalRewardsVolume.plus(
    event.params.winAmount
  );

  // Handle rewards volume for player
  let betsStatisticsForAddressEntity = BetsStatisticsForAddressEntity.load(
    event.params.player.toHexString()
  );

  if (!betsStatisticsForAddressEntity) {
    betsStatisticsForAddressEntity = new BetsStatisticsForAddressEntity(
      event.params.player.toHexString()
    );
    betsStatisticsForAddressEntity.totalBets = 0;
    betsStatisticsForAddressEntity.totalBetsVolume = new BigInt(0);
    betsStatisticsForAddressEntity.totalRewardsVolume = new BigInt(0);
  }

  betsStatisticsForAddressEntity.totalRewardsVolume = betsStatisticsForAddressEntity.totalRewardsVolume.plus(
    event.params.winAmount
  );

  // Save entites
  betSettledEntity.save();
  betsStatisticsEntity.save();
  betsStatisticsForAddressEntity.save();
}

export function handleCoinbetTokenFeeWaiverThresholdUpdated(
  event: CoinbetTokenFeeWaiverThresholdUpdated
): void {}

export function handleHousePoolUpdated(event: HousePoolUpdated): void {}

export function handleMaxBetAmountUpdated(event: MaxBetAmountUpdated): void {}

export function handleMinBetAmountUpdated(event: MinBetAmountUpdated): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handlePaused(event: Paused): void {}

export function handleProtocolFeeUpdated(event: ProtocolFeeUpdated): void {}

export function handleUnpaused(event: Unpaused): void {}
