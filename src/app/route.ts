import { RouteSegmentConfig } from "@/types";
import { redirect } from "next/navigation";

export const runtime: RouteSegmentConfig["runtime"] = "edge";
export const dynamic: RouteSegmentConfig["dynamic"] = "force-static";

export const GET = () => {
  return redirect(
    "https://github.com/peterfritz/time?tab=readme-ov-file#readme"
  );
};
