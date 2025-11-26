"use client";

import { useState } from "react";

export default function UploadPDF({ ebookId }: { ebookId: number }) {
  const [file, setFile] = useState<File | null>(null);

  const upload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/ebooks/${ebookId}/upload-pdf`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      }
    );

    window.location.reload();
  };

  return (
    <div className="p-5 bg-white shadow rounded-xl space-y-3">
      <h3 className="font-semibold">Subir PDF</h3>

      <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />

      <button
        onClick={upload}
        className="w-full bg-black text-white py-2 rounded-xl hover:bg-white hover:text-black border border-black transition"
      >
        Subir PDF
      </button>
    </div>
  );
}
