import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);

      alert("Giriş başarılı!");
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Giriş Yap</h2>

      <input
        type="text"
        placeholder="E-mail"
        onChange={(e) => setEmail(e.target.value)}
      /><br /><br />

      <input
        type="password"
        placeholder="Şifre"
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />

      <button onClick={login}>Giriş Yap</button>
    </div>
  );
}
