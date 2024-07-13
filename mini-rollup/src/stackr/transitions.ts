
import { Transitions, STF } from "@stackr/sdk/machine";
import { GAME, BetterMerkleTree as StateWrapper } from "./state";
import { BytesLike, ethers } from "ethers";

// --------- Utilities ---------
const findIndexOfAccountGame = (state: StateWrapper, address: string) => {
  return state.gameleaves.findIndex((leaf) => leaf.address === address);
};

type CreateInput = {
  address: string;
};

type GameInput = {
  address: string;
  gamestate: string;
};

// --------- State Transition Handlers ---------
const create: STF<GAME, CreateInput> = {
  handler: ({ inputs, state }) => {
    const { address } = inputs;
    state.gameleaves = state.gameleaves || [];
    if (state.gameleaves.find((leaf) => leaf.address === address)) {
      throw new Error("Account already exists");
    }
    state.gameleaves.push({
      address,
      gamestate: "",
      timestamp: Date.now(), // timestamp in milliseconds
    });
    return state;
  },
};

const updateGamestate: STF<GAME, GameInput> = {
  handler: ({ inputs, state }) => {
    const { address, gamestate } = inputs;
    const index = findIndexOfAccountGame(state, address);
   
    state.gameleaves[index].gamestate = gamestate;
    return state;
  },
};

export const transitions: Transitions<GAME> = {
  create,
  updateGamestate
};