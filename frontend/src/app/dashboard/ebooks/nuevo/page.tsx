"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import EbookForm, { CreateEbookDto } from "@/components/ebooks/EbookForm";
import { useAuth } from "@/context/AuthContext";

export default function NuevoEbookPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

const handleSubmit = async (data: CreateEbookDto, files: { pdf?: File | null; portada?: File | null }) => {
  try {
    setLoading(true);

    // 1️⃣ Crear el ebook
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ebooks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Error al crear el ebook");

    const ebook = await res.json();
    const ebookId = ebook.id;

    // 2️⃣ Subir PDF
    if (files.pdf) {
      const formData = new FormData();
      formData.append("file", files.pdf);

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ebooks/${ebookId}/upload-pdf`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
    }

    // 3️⃣ Subir portada
    if (files.portada) {
      const formData = new FormData();
      formData.append("file", files.portada);

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ebooks/${ebookId}/upload-portada`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
    }

    router.push("/dashboard/ebooks");
  } catch (error) {
    console.error(error);
    alert("No se pudo crear el ebook");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="p-5">
      <EbookForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
