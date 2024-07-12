import { StateMachine } from "@stackr/sdk/machine";
import genesisState from "../../genesis-state.json";
import { transitions } from "./transitions";
import { GAME } from "./state";

const machine = new StateMachine({
  id: "game-mud-state2",
  stateClass: GAME,
  initialState: genesisState.state,
  on: transitions,
});

export { machine };

/*
import { State, StateMachine } from "@stackr/sdk/machine";
import { solidityPackedKeccak256 } from "ethers";

import genesisState from "../../genesis-state.json";
import { transitions } from "./transitions";

import {GAME} from "./state";

const machine = new StateMachine({
  id: "game-mud-state",
  stateClass: GAME,
  initialState: genesisState.state,
  on: transitions,
});

export { machine };

*/