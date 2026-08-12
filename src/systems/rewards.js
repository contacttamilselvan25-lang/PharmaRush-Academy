import { BALANCE } from "../config.js";
import { clamp } from "../core/utils.js";
import { xpForCase } from "./xp.js";
import { coinsForCase } from "./coins.js";
import { reputationDelta } from "./reputation.js";

export function computeRewards({ difficulty, tier, comboMult = 1 }) {
  return {
    tier,
    xp: xpForCase({ difficulty, tier }),
    coins: coinsForCase({ difficulty, tier, comboMult }),
    rep: reputationDelta(tier),
  };
}

export function applyRewards(state, rewards) {
  state.player.xp += Math.max(0, rewards.xp);
  state.player.coins += Math.max(0, rewards.coins);
  state.player.reputation = clamp(
    state.player.reputation + rewards.rep,
    BALANCE.REPUTATION_MIN,
    BALANCE.REPUTATION_MAX
  );
  return rewards;
}
