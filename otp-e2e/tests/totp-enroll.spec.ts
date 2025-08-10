import { test, expect } from "@playwright/test";
import crypto from "crypto";

function totp(secret: string): string {
  const key = Buffer.from(secret, "base64");
  const time = Math.floor(Date.now() / 1000 / 30);
  const buffer = Buffer.alloc(8);
  buffer.writeUInt32BE(0, 0);
  buffer.writeUInt32BE(time, 4);
  const hmac = crypto.createHmac("sha1", key).update(buffer).digest();
  const offset = hmac[19] & 0xf;
  const code = ((hmac[offset] & 0x7f) << 24 |
                (hmac[offset + 1] & 0xff) << 16 |
                (hmac[offset + 2] & 0xff) << 8 |
                (hmac[offset + 3] & 0xff)) % 1000000;
  return String(code).padStart(6, "0");
}

test("TOTP enroll and confirm API", async ({ request }) => {
  const email = `user-${Date.now()}@demo.local`;
  const enroll = await request.post("/api/totp/enroll", { data: { email } });
  expect(enroll.ok()).toBeTruthy();
  const { secret } = await enroll.json();
  const code = totp(secret);
  const confirm = await request.post("/api/totp/confirm", { data: { email, code } });
  expect(confirm.ok()).toBeTruthy();
});
