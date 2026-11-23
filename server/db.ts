import { neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";
import { env } from "./env";

// Node has no global WebSocket for the driver; needed for Pool/transactions.
neonConfig.webSocketConstructor = ws;

export const pool = new Pool({ connectionString: env.DATABASE_URL });
