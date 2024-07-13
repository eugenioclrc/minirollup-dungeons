import express, { Request, Response } from "express";
import { ActionEvents } from "@stackr/sdk";
import { Playground } from "@stackr/sdk/plugins";
import dotenv from "dotenv";
import { schemas } from "./stackr/actions.ts";
import { GameMachine, mru } from "./stackr/game.ts";
import { transitions } from "./stackr/transitions.ts";
import cors from "cors";

console.log("Starting server...");
dotenv.config();

const gameMachine = mru.stateMachines.get<GameMachine>("game-mud-state2");


const app = express();
app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === "development") {
  const playground = Playground.init(mru);

  playground.addGetMethod(
    "/custom/hello",
    async (_req: Request, res: Response) => {
      res.send("Hello World");
    }
  );
}

const { actions, chain, events } = mru;

events.subscribe(ActionEvents.SUBMIT, (args) => {
  console.log("Submitted an action", args);
});

events.subscribe(ActionEvents.EXECUTION_STATUS, async (action) => {
  console.log("Submitted an action", action);
});

app.get("/actions/:hash", async (req: Request, res: Response) => {
  const { hash } = req.params;
  const action = await actions.getByHash(hash);
  if (!action) {
    return res.status(404).send({ message: "Action not found" });
  }
  return res.send(action);
});

app.get("/blocks/:hash", async (req: Request, res: Response) => {
  const { hash } = req.params;
  const block = await chain.getBlockByHash(hash);
  if (!block) {
    return res.status(404).send({ message: "Block not found" });
  }
  return res.send(block.data);
});

app.post("/:reducerName", async (req: Request, res: Response) => {
  const { reducerName } = req.params;
  const actionReducer = transitions[reducerName];

  if (!actionReducer) {
    res.status(400).send({ message: "̦̦no reducer for action" });
    return;
  }
  const action = reducerName as keyof typeof schemas;

  const { msgSender, signature, inputs } = req.body;

  const schema = schemas[action];

  try {
    const newAction = schema.actionFrom({ msgSender, signature, inputs });
    const ack = await mru.submitAction(reducerName, newAction);
    res.status(201).send({ ack });
  } catch (e: any) {
    res.status(400).send({ error: e.message });
  }
  return;
});

type ActionName = keyof typeof schemas;

app.get("/getEIP712Types/:action", (_req: Request, res: Response) => {
  //@ts-ignore
  const { action }: { action: ActionName } = _req.params;
  const eip712Types = schemas[action].EIP712TypedData.types;
  return res.send({ eip712Types });
});http://localhost:3004/game/

app.get("/game/:wallet", (_req: Request, res: Response) => {
  const { wallet }: { wallet: string } = _req.params;
  console.log(gameMachine?.state)

  const game = gameMachine?.state.game && gameMachine?.state.game.find((w) => w.address === wallet);
  return res.send({ state: gameMachine?.state, game });
});



//app.get("/", (_req: Request, res: Response) => {
//  return res.send({ state: gameMachine?.state });
//});

app.listen(3004, () => {
  console.log("listening on port 3004");
});
