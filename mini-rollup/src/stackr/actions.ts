/*
export const UpdateCounterSchema = new ActionSchema("update-counter", {
  timestamp: SolidityType.UINT,
});
*/

import { ActionSchema, SolidityType } from "@stackr/sdk";


export const createAccountSchema = new ActionSchema("createAccount", {
  address: SolidityType.ADDRESS,
});

export const gameSchema = new ActionSchema("game", {
  address: SolidityType.ADDRESS,
  gamestate: SolidityType.BYTES,  // state of game will be a base64 encoded string for now
  timestamp: SolidityType.UINT,  // timestamp of the game state
});


export const schemas = {
  create: createAccountSchema,
  updateScore: gameSchema
};