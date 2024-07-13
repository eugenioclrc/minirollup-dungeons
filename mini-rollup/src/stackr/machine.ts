import { StateMachine } from "@stackr/sdk/machine";
import initialState from "../../genesis-state.json";
import { transitions } from "./transitions";
import { GAME } from "./state";

const machine = new StateMachine({
  id: "game-mud-state2",
  stateClass: GAME,
  initialState,
  on: transitions,
});

export { machine };
