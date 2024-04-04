import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    SECRET: z.string().min(16).max(64),
  },
  runtimeEnv: {
    SECRET: process.env.SECRET,
  },
});
