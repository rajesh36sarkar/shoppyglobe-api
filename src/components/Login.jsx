import React, { useState } from "react";

export default function Login({ onLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // important: allow cookies (refresh token)
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || data.message || "Login failed");
        return;
      }

      // access token returned in JSON
      const accessToken = data.accessToken || data.accessToken; // in our backend it's accessToken
      // call onLoggedIn(accessToken) to keep it in memory in top-level state
      onLoggedIn(accessToken, data.user);
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Login</h2>
      <div>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      </div>
      <div>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      </div>
      <button type="submit">Login</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
}
