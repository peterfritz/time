<hr />

<div align="center">
  <a href="#">
    <img src="src/app/icon.svg" alt="time" height="100" >
  </a>
</div>

<div align="center">
  <h1>
    time
    <a
      href="https://www.youtube.com/watch?v=Qr0-7Ds79zo"
      target="_blank"
      rel="noopener noreferrer"
    >
      <kbd>↗</kbd>
    </a>
  </h1>
  <p>
    <b>
      Get the current time, timezone, and a language-sensitive representation of the current time in the local timezone based on the user's IP.
    </b>
    <br />
    <b>
      Create and validate signed date tokens.
    </b>
  </p>
</div>

<hr />

## <kbd>GET</kbd> `https://time.ptr.red/geo`

Get the current time, timezone, and a language-sensitive representation of the current time in the local timezone based on the user's IP.

This API endpoint returns a JSON object with the following properties:

```jsonc
{
  "timezone": "Europe/Paris", // IANA timezone
  "offset": -120, // offset from UTC in minutes
  "time": 1712238688600, // unix timestamp in milliseconds
  "unix": 1712238688, // unix timestamp in seconds
  "ISO": "2024-04-04T13:51:28.600Z", // ISO8601
  "RFC2822": "Thu, 04 Apr 2024 13:51:28 GMT", // RFC2822
  "locale": "Donnerstag, 4. April 2024 um 15:51:28 Mitteleuropäische Sommerzeit", // localized time
  "location": {
    "latitude": 53.5544, // latitude
    "longitude": 9.9946, // longitude
    "country": "DE", // ISO 3166-1 alpha-2 country code
    "countryRegion": "HH", // ISO 3166-2 alpha-2 country code
    "city": "Hamburg", // city
    "flag": "🇩🇪", // flag emoji
  },
}
```

## <kbd>POST</kbd> `https://time.ptr.red/token/sign`

Get a signed date token that can be used to verify the authenticity of the time the token was created in the future.

Request body:

```jsonc
{
  "id": "string", // unique identifier
}
```

Response body:

```jsonc
{
  "token": "ptr::1712239399::cf90e3f8b1290cfb8ff1b1d4127c887582bdf37071f3f39f45748a8e81d6386239b6322e15b2c8e5d4adf99a851bce15d5ba0d5963be388ab6d3cc6bae8b9db0", // "id::unix_time::signature"
}
```

## <kbd>POST</kbd> `https://time.ptr.red/token/validate`

Validate a signed date token.

Request body:

```jsonc
{
  "token": "ptr::1712239399::cf90e3f8b1290cfb8ff1b1d4127c887582bdf37071f3f39f45748a8e81d6386239b6322e15b2c8e5d4adf99a851bce15d5ba0d5963be388ab6d3cc6bae8b9db0", // signed date token
}
```

Response body:

```jsonc
{
  "valid": true, // valid token
  "id": "ptr", // unique identifier
  "time": 1712239399, // unix timestamp in seconds
}
```
