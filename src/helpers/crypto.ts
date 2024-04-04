export const hmacSign = async (secret: string, body: string) => {
  const toHex = (arrayBuffer: ArrayBuffer) =>
    Array.prototype.map
      .call(new Uint8Array(arrayBuffer), (n) => n.toString(16).padStart(2, "0"))
      .join("");

  const key = crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: { name: "SHA-512" } },
    false,
    ["sign"]
  );

  const signature = toHex(
    await crypto.subtle.sign("HMAC", await key, new TextEncoder().encode(body))
  );

  return signature;
};
