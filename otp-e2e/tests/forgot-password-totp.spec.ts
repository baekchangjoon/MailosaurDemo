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

test("Forgot password via TOTP", async ({ page, request }) => {
  const email = `user-${Date.now()}@demo.local`;
  const enroll = await request.post("/api/totp/enroll", { data: { email } });
  const { secret } = await enroll.json();
  let code = totp(secret);
  await request.post("/api/totp/confirm", { data: { email, code } });
  code = totp(secret);

  await page.goto("/");
  await page.getByRole("button", { name: "비밀번호 찾기" }).click();
  await page.getByText("Authenticator").click();
  await page.getByLabel("메일 주소").fill(email);
  await page.getByLabel("Authenticator 값 입력").fill(code);
  await page.getByRole("button", { name: "확인" }).click();
  await expect(page.getByText("당신의 비밀번호")).toBeVisible();
});
