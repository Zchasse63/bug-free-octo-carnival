import { config } from "dotenv";
import { resolve } from "node:path";
config({ path: resolve(process.cwd(), ".env.local") });

console.log("ANTHROPIC_API_KEY len:", (process.env.ANTHROPIC_API_KEY ?? "").length);
console.log("OPENAI_API_KEY len:", (process.env.OPENAI_API_KEY ?? "").length);
console.log("first 8 of ANTHROPIC:", (process.env.ANTHROPIC_API_KEY ?? "").slice(0, 8));
