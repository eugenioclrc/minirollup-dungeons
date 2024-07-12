import { State } from "@stackr/sdk/machine";
import { BytesLike, ZeroHash, solidityPackedKeccak256 } from "ethers";
import { MerkleTree } from "merkletreejs";

export type GameState = {
    address: string;  // address of the player
    gamestate: BytesLike;  // state of game will be a base64 encoded string for now
    timestamp: number;  // timestamp of the game state
}[];

export type GameVariable = {
  game: GameState;
};

export class BetterMerkleTree {
  public merkleTreeGame: MerkleTree;
  public gameleaves: GameState;

  constructor(game: GameState) {
    let { merkleTreeGame } = this.createTree(
      game
    );

    this.merkleTreeGame = merkleTreeGame;
    this.gameleaves = game;
  }

  createTree(game: GameState) {
    game = game || [];
    const hashedLeavesGame = game.map((leaf) => {
      return solidityPackedKeccak256(
        ["address", "bytes", "uint256"],
        [leaf.address, leaf.gamestate, leaf.timestamp]
      );
    });
    let merkleTreeGame = new MerkleTree(hashedLeavesGame);

    return { merkleTreeGame };
  }
}

export class GAME extends State<GameVariable, BetterMerkleTree> {
  constructor(state: GameVariable) {
    super(state);
  }

  transformer() {
    return {
      wrap: () => {
        return new BetterMerkleTree(this.state.game);
      },
      unwrap: (wrappedState: BetterMerkleTree) => {
        return {
          game: wrappedState.gameleaves,
        };
      },
    };
  }

  getRootHash(): BytesLike {
    if (!this.state || !this.state.game || this.state.game.length === 0) {
      return ZeroHash;
    }
    if (this.state.game.length !== 0) {
      return this.transformer().wrap().merkleTreeGame.getRoot();
    }
   
    return solidityPackedKeccak256(
      ["bytes"],
      [
        this.transformer().wrap().merkleTreeGame.getHexRoot(),
      ]
    );
  }
}
/*

import { State, StateMachine } from "@stackr/sdk/machine";
import { solidityPackedKeccak256 } from "ethers";

import * as genesisState from "../../genesis-state.json";
import { transitions } from "./transitions";

export type GameStateType = {
    address: string;  // address of the player
    gamestate: string;  // state of game will be a base64 encoded string for now
}

export type GAMEMANAGERStateType = {
    games: GameStateType[];
  };
  
  export class GameManagerState extends State<GAMEMANAGERStateType> {
 
    constructor(games: UTXOStateType) {

        this.merkleTreeUTXO = this.createTree(leaves.utxos);
        this.games = games;
    }
  }
    */