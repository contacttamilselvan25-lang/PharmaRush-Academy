import { BALANCE, OUTCOME_MULTIPLIER } from "../config.js";
import { clamp } from "../core/utils.js";

export function reputationDelta(tier) {
  return OUTCOME_MULTIPLIER[tier]?.rep ?? 0;
}

export function applyReputation(state, delta) {
  state.player.reputation = clamp(
    state.player.reputation + delta,
    BALANCE.REPUTATION_MIN,
    BALANCE.REPUTATION_MAX
  );
  return state.player.reputation;
}
