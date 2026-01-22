"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(to bottom right, #fef2f2, #ffffff, #fff7ed)",
            padding: "1rem",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          <div
            style={{
              maxWidth: "600px",
              textAlign: "center",
              padding: "2rem",
              background: "white",
              borderRadius: "1rem",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            }}
          >
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                color: "#1f2937",
                marginBottom: "1rem",
              }}
            >
              Eroare Critică
            </h1>
            <p
              style={{
                fontSize: "1.125rem",
                color: "#6b7280",
                marginBottom: "2rem",
              }}
            >
              A apărut o eroare critică. Te rugăm să reîncarci pagina.
            </p>
            <button
              onClick={reset}
              style={{
                background: "#8b5cf6",
                color: "white",
                padding: "0.75rem 2rem",
                borderRadius: "0.5rem",
                border: "none",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                marginRight: "1rem",
              }}
            >
              Încearcă din nou
            </button>
            <a
              href="/"
              style={{
                background: "white",
                color: "#8b5cf6",
                padding: "0.75rem 2rem",
                borderRadius: "0.5rem",
                border: "2px solid #8b5cf6",
                fontSize: "1rem",
                fontWeight: "600",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Pagina Principală
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
