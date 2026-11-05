import { cors } from "@elysiajs/cors"
import { Elysia } from "elysia"
import { CloudflareAdapter } from "elysia/adapter/cloudflare-worker"

import { auth } from "./modules/auth"
import { exercises } from "./modules/exercises"
import { foods } from "./modules/foods"
import { health } from "./modules/health"
import { meals } from "./modules/meals"
import { mealAnalysis } from "./modules/meals/analysis"
import { targets } from "./modules/targets"
import { user } from "./modules/user"
import { workouts } from "./modules/workouts"
import { fitwearOpenapi } from "./openapi-config"

export function buildFitwearApp() {
  return new Elysia({ adapter: CloudflareAdapter })
    .use(
      cors({
        origin: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        exposeHeaders: ["Content-Length"],
        maxAge: 600,
        credentials: false,
      }),
    )
    .use(fitwearOpenapi)
    .use(auth)
    .use(user)
    .use(foods)
    .use(targets)
    .use(meals)
    .use(mealAnalysis)
    .use(exercises)
    .use(workouts)
    .use(health)
    .get("/", () => ({
      name: "VoocHealth Backend API",
      status: "online",
      framework: "ElysiaJS",
      docs: "/swagger",
      openapi: "/swagger/json",
    }))
}

export const app = buildFitwearApp().compile()
