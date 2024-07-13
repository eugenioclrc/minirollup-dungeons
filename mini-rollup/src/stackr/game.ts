import { MicroRollup } from "@stackr/sdk";
import { stackrConfig } from "../../stackr.config.ts";

import { createAccountSchema, schemas } from "./actions.ts";
import { machine } from "./machine.ts";

type GameMachine = typeof machine;

const mru = await MicroRollup({
  config: stackrConfig,
  actionSchemas: [createAccountSchema, ...Object.values(schemas)],
  stateMachines: [machine],
  isSandbox: true, // @todo remove this if not is in dev mode
});

await mru.init();

export { GameMachine, mru };