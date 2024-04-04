import { languages } from "@/helpers/languages";
import { RouteSegmentConfig } from "@/types";
import { geolocation } from "@vercel/edge";
import { find } from "geo-tz/now";
import { NextRequest, NextResponse } from "next/server";

export const runtime: RouteSegmentConfig["runtime"] = "nodejs";

const getTimeData = ({
  timezone = "UTC",
  language,
  country = "unknown",
}: {
  timezone: string;
  language?: string;
  country?: string;
}) => {
  process.env.TZ = timezone;

  const time = new Date();

  time.setUTCMilliseconds(Math.floor(time.getUTCMilliseconds() / 100) * 100);

  let languageCode = "en-US";

  if (language) {
    languageCode = language;
  } else if (country) {
    const countryLanguage = languages[country.toUpperCase()];

    if (countryLanguage) {
      languageCode = countryLanguage;
    }
  }

  const timeData = {
    timezone,
    offset: time.getTimezoneOffset() * -1,
    time: time.getTime(),
    unix: Math.floor(time.getTime() / 1000),
    ISO: time.toISOString(),
    RFC2822: time.toUTCString(),
    locale: time.toLocaleString(languageCode, {
      timeZone: timezone,
      timeZoneName: "long",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  };

  process.env.TZ = "UTC";

  return timeData;
};

export const GET = (request: NextRequest) => {
  const {
    headers,
    nextUrl: { searchParams },
  } = request;

  const { latitude, longitude, country, countryRegion, city, flag } =
    geolocation(request);

  const languageSearchParam = searchParams.get("language");
  const acceptLanguageHeader = headers.get("accept-language");

  const acceptHeader = headers.get("accept");

  if (
    acceptHeader &&
    acceptHeader.split(",").some((value) => value.includes("text/html"))
  ) {
    return NextResponse.redirect(
      "https://github.com/peterfritz/time?tab=readme-ov-file#readme"
    );
  }

  const language =
    [
      languageSearchParam,
      acceptLanguageHeader && acceptLanguageHeader.split(",")[0],
    ].find((value) => value) || undefined;

  if (
    latitude &&
    longitude &&
    !isNaN(Number(latitude)) &&
    !isNaN(Number(longitude))
  ) {
    const timezone = find(Number(latitude), Number(longitude));

    return NextResponse.json(
      {
        ...getTimeData({
          timezone: timezone[0],
          language,
          country,
        }),
        location: {
          latitude: Number(latitude),
          longitude: Number(longitude),
          country,
          countryRegion,
          city: decodeURIComponent(city || ""),
          flag,
        },
      },
      {}
    );
  }

  return NextResponse.json(
    getTimeData({
      timezone: "UTC",
      language,
      country: "unknown",
    }),
    {}
  );
};
