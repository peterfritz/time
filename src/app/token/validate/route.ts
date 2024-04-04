import { env } from "@/env/server";
import { hmacSign } from "@/helpers/crypto";
import { RouteSegmentConfig } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime: RouteSegmentConfig["runtime"] = "edge";

const requestSchema = z.object({
  token: z
    .string()
    .regex(/^[a-zA-Z0-9\-_]{1,32}::[0-9]{1,}::(?:[0-9a-f]{64}|[0-9a-f]{128})$/),
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

  const [id, unixTime, signature] = body.data.token.split("::");

  const expectedSignature = await hmacSign(
    env.SECRET,
    [id, unixTime].join("::")
  );

  if (expectedSignature !== signature) {
    return NextResponse.json({
      error: ["Invalid token signature."],
    });
  }

  return NextResponse.json({
    valid: true,
    id,
    unix: unixTime,
  });
};
