import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Register from "./auth/Register.jsx";
import Login from "./auth/Login.jsx";
import "./App.css";

/* Haber sayfası (önceki App component'i) */
function AppNews() {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState("technology");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/news?category=${category}`);
        const data = await res.json();
        setArticles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Haber çekme hatası:", err);
        setArticles([]);
      }
      setLoading(false);
    };

    fetchNews();
  }, [category]);

  const categories = [
    { value: "technology", label: "Teknoloji" },
    { value: "sports", label: "Spor" },
    { value: "business", label: "Ekonomi" },
    { value: "entertainment", label: "Eğlence" },
    { value: "health", label: "Sağlık" },
    { value: "science", label: "Bilim" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">📰 Haber Akışı</h1>
          <p className="text-slate-400">En güncel haberleri takip edin</p>
        </header>

        <div className="mb-8 bg-slate-800 rounded-lg p-6 shadow-lg">
          <label className="block text-white font-semibold mb-3">Kategori Seçin</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  category === cat.value
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-4 text-slate-400">Yükleniyor...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.length > 0 ? (
              articles.map((a, i) => (
                <article
                  key={i}
                  className="bg-slate-800 rounded-lg p-6 shadow-lg hover:shadow-xl hover:bg-slate-750 transition-all border border-slate-700"
                >
                  <h3 className="text-xl font-bold text-white mb-2">{a.title}</h3>
                  <p className="text-slate-400 mb-4">{a.description}</p>
                  {a.url && (
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Habere Git →
                    </a>
                  )}
                </article>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400">
                <p className="text-lg">Bu kategoride haber bulunamadı.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* Router içeren ana component - App.jsx artık router'ı export eder */
export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: 16, background: "rgba(255,255,255,0.02)" }}>
        <Link to="/" style={{ marginRight: 8 }}>Ana Sayfa</Link>
        <Link to="/register" style={{ marginRight: 8 }}>Kayıt Ol</Link>
        <Link to="/login">Giriş Yap</Link>
      </nav>

      <Routes>
        <Route path="/" element={<AppNews />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
