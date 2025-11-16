import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    try {
      await axios.post("http://localhost:5000/auth/register", {
        email,
        password
      });
      alert("Kayıt başarılı!");
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Kayıt Ol</h2>

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

      <button onClick={register}>Kayıt Ol</button>
    </div>
  );
}
