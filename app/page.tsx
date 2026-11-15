// Home Page
// Displays the form for submitting a URL and alias
"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [message, setMessage] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setShortUrl("");

    const res = await fetch("/api/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, alias }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Something went wrong.");
    } else {
      setShortUrl(`${window.location.origin}/${data.alias}`);
      setMessage("Short URL created successfully!");
      setUrl("");
      setAlias("");
    }
  }

  return (
      <main style={{ maxWidth: "600px", margin: "50px auto", padding: "20px" }}>
        <h1>URL Shortener</h1>
        <p style={{ color: "#666", marginBottom: "30px" }}>
          Shorten your long URLs into compact, shareable links
        </p>

        <h2>Shorten a URL</h2>
        <p style={{ color: "#666", marginBottom: "15px" }}>
          Enter a long URL to create a shorter, shareable link
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="url">URL:</label>
            <input
                id="url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/very/long/url"
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                required
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="alias">Custom Alias:</label>
            <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  marginTop: "5px",
                  overflow: "hidden",
                }}
            >
            <span
                style={{
                  padding: "8px",
                  background: "#f5f5f5",
                  color: "#666",
                  fontSize: "14px",
                  whiteSpace: "nowrap",
                }}
            >
              {origin}/
            </span>
              <input
                  id="alias"
                  type="text"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  placeholder="your-custom-alias"
                  style={{
                    flex: 1,
                    padding: "8px",
                    border: "none",
                    outline: "none",
                  }}
                  required
              />
            </div>
          </div>

          <button type="submit" style={{ padding: "10px 20px" }}>
            Shorten
          </button>
        </form>

        {message && <p style={{ color: shortUrl ? "green" : "red" }}>{message}</p>}

        {shortUrl && (
            <div style={{ marginTop: "20px", padding: "10px", background: "#f0f0f0" }}>
              <p>Your short URL:</p>
              <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                {shortUrl}
              </a>
            </div>
        )}
      </main>
  );
}