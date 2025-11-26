"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface Props {
  ebookId: number;
}

export default function DownloadEbookButton({ ebookId }: Props) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!token) {
      alert("Debes iniciar sesión para descargar este ebook");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ebooks/${ebookId}/download`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "No se pudo descargar el ebook");
        setLoading(false);
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ebook-${ebookId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Error descargando el ebook");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="bg-white text-black px-6 py-3 rounded-xl hover:bg-black hover:text-white border border-gray-800 transition"
    >
      {loading ? "Descargando..." : "Descargar Ebook"}
    </button>
  );
}
