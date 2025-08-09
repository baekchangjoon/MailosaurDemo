import { test, expect } from "@playwright/test";
import Mailosaur from "mailosaur";
require("dotenv").config();

const serverId = process.env.MAILOSAUR_SERVER_ID!;
const apiKey = process.env.MAILOSAUR_API_KEY!;
const testEmail = process.env.TEST_EMAIL!;
const subject = process.env.MAIL_SUBJECT || "[Demo] Your OTP Code";

const extractOtp = (text: string) => {
  const m = text.match(/\b(\d{6})\b/);
  if (!m) throw new Error("OTP not found");
  return m[1];
};

test("비밀번호 찾기: 메일로 받은 OTP로 비밀번호 노출", async ({ page }) => {
  const mailosaur = new Mailosaur(apiKey);

  await page.goto("/");
  await page.getByTestId("login-email").fill(testEmail);
  await page.getByTestId("forgot-button").click();

  await page.getByTestId("fp-email").fill(testEmail);
  await page.getByTestId("send-otp").click();

  // Wait for the email to arrive and extract OTP
  const message = await mailosaur.messages.get(serverId, {
    sentTo: testEmail,
    subject
  }, { timeout: 30_000 });

  const body = (message.text?.body || message.html?.body || "");
  const otp = extractOtp(body);

  await page.getByTestId("otp-input").fill(otp);
  await page.getByTestId("confirm-otp").click();

  const revealed = page.getByTestId("revealed-password");
  await expect(revealed).toContainText("당신의 비밀번호:");
});
