import React, { useState } from "react";
import { QRCode } from "qrcode.react";

const BACKEND_URL = (import.meta as any).env.VITE_BACKEND_URL || "";

const api = async (url: string, body: unknown) => {
  const res = await fetch(BACKEND_URL + url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json().catch(() => ({}));
};

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState<"email" | "totp">("email");
  const [fpEmail, setFpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpauthUri, setOtpauthUri] = useState("");
  const [revealedPassword, setRevealedPassword] = useState("");

  const sendEmailOtp = async () => {
    await api("/api/otp/send", { email: fpEmail });
    alert("인증번호를 보냈습니다.");
  };

  const verifyEmailOtp = async () => {
    const r: any = await api("/api/otp/verify", { email: fpEmail, code: otp });
    setRevealedPassword(r.password);
  };

  const enrollTotp = async () => {
    const r: any = await api("/api/totp/enroll", { email: fpEmail });
    setOtpauthUri(r.otpauthUri);
  };

  const verifyTotp = async () => {
    const r: any = await api("/api/totp/verify", { email: fpEmail, code: otp });
    setRevealedPassword(r.password);
  };

  return (
    <div style={{ maxWidth: 420, margin: "80px auto", fontFamily: "sans-serif" }}>
      <h2>Demo Login</h2>
      <div>
        <label>메일 주소</label>
        <input
          data-testid="login-email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>
      <div style={{ marginTop: 8 }}>
        <label>패스워드</label>
        <input
          data-testid="login-password"
          type="password"
          value={pwd}
          onChange={e => setPwd(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>
      <button
        data-testid="forgot-button"
        onClick={() => {
          setShowModal(true);
          setFpEmail(email);
          setMode("email");
          setOtp("");
          setOtpauthUri("");
          setRevealedPassword("");
        }}
        style={{ marginTop: 12 }}
      >
        비밀번호 찾기
      </button>
      {showModal && (
        <div role="dialog" style={{ border: "1px solid #ddd", padding: 16, marginTop: 20 }}>
          <h3>비밀번호 찾기</h3>
          <div>
            <label>메일 주소</label>
            <input
              data-testid="fp-email"
              value={fpEmail}
              onChange={e => setFpEmail(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginTop: 8 }}>
            <label style={{ marginRight: 12 }}>
              <input
                type="radio"
                checked={mode === "email"}
                onChange={() => {
                  setMode("email");
                  setOtpauthUri("");
                  setOtp("");
                  setRevealedPassword("");
                }}
              />
              이메일 OTP
            </label>
            <label>
              <input
                type="radio"
                checked={mode === "totp"}
                onChange={() => {
                  setMode("totp");
                  setOtpauthUri("");
                  setOtp("");
                  setRevealedPassword("");
                }}
              />
              Authenticator
            </label>
          </div>
          {mode === "email" && (
            <div>
              <button data-testid="send-otp" onClick={sendEmailOtp} style={{ marginTop: 8 }}>
                인증 번호 받기
              </button>
              <div style={{ marginTop: 8 }}>
                <label>인증번호</label>
                <input
                  data-testid="otp-input"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                />
                <button
                  data-testid="confirm-otp"
                  onClick={verifyEmailOtp}
                  style={{ marginLeft: 8 }}
                >
                  확인
                </button>
              </div>
            </div>
          )}
          {mode === "totp" && (
            <div>
              <div style={{ marginTop: 8 }}>
                <button data-testid="enroll-totp" onClick={enrollTotp}>
                  Authenticator 등록
                </button>
              </div>
              {otpauthUri && (
                <div style={{ marginTop: 8 }}>
                  <div>QR을 스캔하세요</div>
                  <QRCode value={otpauthUri} size={160} />
                </div>
              )}
              <div style={{ marginTop: 8 }}>
                <label>Authenticator 값 입력</label>
                <input
                  data-testid="otp-input"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder="6자리"
                />
                <button
                  data-testid="confirm-otp"
                  onClick={verifyTotp}
                  style={{ marginLeft: 8 }}
                >
                  확인
                </button>
              </div>
            </div>
          )}
          {revealedPassword && (
            <div data-testid="revealed-password" style={{ marginTop: 12 }}>
              당신의 비밀번호: <b>{revealedPassword}</b>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
