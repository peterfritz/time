import { env } from "@/env/server";
import { hmacSign } from "@/helpers/crypto";
import { RouteSegmentConfig } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime: RouteSegmentConfig["runtime"] = "edge";

const requestSchema = z.object({
  id: z.string().regex(
    /^[a-zA-Z0-9\-_]{1,32}$/,
    `
      ID must be between 1 and 32 characters long and can only contain letters, numbers, hyphens, and underscores.
    `.trim()
  ),
});

export const POST = async (request: NextRequest) => {
  const body = requestSchema.safeParse(await request.json());

  if (!body.success) {
    return NextResponse.json(
      {
        error: body.error.issues.map((issue) => issue.message),
      },
      {
        status: 400,
      }
    );
  }

  const { id } = body.data;

  const date = new Date();

  const unixTime = Math.floor(date.getTime() / 1000);

  const message = [id, unixTime].join("::");

  const signature = await hmacSign(env.SECRET, message);

  const token = [message, signature].join("::");

  return NextResponse.json({
    token,
  });
};
