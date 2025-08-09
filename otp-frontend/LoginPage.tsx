import React, { useState } from "react";

const api = async (url: string, body: unknown) => {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(res.statusText);
  return res.json().catch(() => ({}));
};

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [fpEmail, setFpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [revealed, setRevealed] = useState("");

  const sendOtp = async () => {
    await api("/api/otp/send", { email: fpEmail });
    alert("인증번호를 보냈습니다.");
  };

  const verify = async () => {
  const r: any = await api("/api/otp/verify", { email: fpEmail, code: otp });
  setRevealed(r.password);
  };

  return (
    <div style={{ maxWidth: 420, margin: "80px auto", fontFamily: "sans-serif" }}>
      <h2>Demo Login</h2>
      <div>
        <label>메일 주소</label>
        <input data-testid="login-email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%" }} />
      </div>
      <div style={{ marginTop: 8 }}>
        <label>패스워드</label>
        <input data-testid="login-password" type="password" value={pwd} onChange={e => setPwd(e.target.value)} style={{ width: "100%" }} />
      </div>
      <button data-testid="forgot-button" onClick={() => {
        setShowModal(true);
        setFpEmail(email);
      }} style={{ marginTop: 12 }}>
        비밀번호 찾기
      </button>

      {showModal && (
        <div role="dialog" style={{ border: "1px solid #ddd", padding: 16, marginTop: 20 }}>
          <h3>비밀번호 찾기</h3>
          <div>
            <label>메일 주소</label>
            <input data-testid="fp-email" value={fpEmail} onChange={e => setFpEmail(e.target.value)} style={{ width: "100%" }} />
          </div>
          <button data-testid="send-otp" onClick={sendOtp} style={{ marginTop: 8 }}>
            인증 번호 받기
          </button>
          <div style={{ marginTop: 10 }}>
            <label>인증번호</label>
            <input data-testid="otp-input" value={otp} onChange={e => setOtp(e.target.value)} />
            <button data-testid="confirm-otp" onClick={verify} style={{ marginLeft: 8 }}>
              확인
            </button>
          </div>
          {revealed && (
            <div data-testid="revealed-password" style={{ marginTop: 12 }}>
              당신의 비밀번호: <b>{revealed}</b>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
