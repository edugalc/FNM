/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import EbookForm, { CreateEbookDto } from "@/components/ebooks/EbookForm";
import { useAuth } from "@/context/AuthContext";

export default function EditarEbookPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();

  const id = params?.id;
  const [ebook, setEbook] = useState<CreateEbookDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Cargar ebook
  useEffect(() => {
    if (!id) return;

    const fetchEbook = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ebooks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al cargar ebook");

        const data = await res.json();
        setEbook({
          titulo: data.titulo,
          descripcion: data.descripcion || "",
          autor: data.autor || "",
          precio: data.precio,
          isActive: data.isActive,
        });
      } catch (err) {
        console.error(err);
        alert("No se pudo cargar el ebook");
      } finally {
        setLoading(false);
      }
    };

    fetchEbook();
  }, [id, token]);

  if (loading)
    return <p className="text-center text-gray-600 py-10">Cargando ebook...</p>;

  if (!ebook)
    return <p className="text-center text-gray-600 py-10">No se encontró el ebook.</p>;

  // Guardar cambios
  const handleSubmit = async (
    data: CreateEbookDto,
    files: { pdf?: File | null; portada?: File | null }
  ) => {
    if (!id) {
      alert("ID del ebook no válido");
      return;
    }

    if (!token) {
      alert("No estás autenticado");
      return;
    }

    try {
      setSaving(true);

      // Actualizar datos
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ebooks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const text = await res.text(); // Para debugging
      console.log("PATCH response:", res.status, text);

      if (!res.ok) throw new Error("Error al actualizar el ebook");

      // Subir PDF
      if (files.pdf) {
        const formData = new FormData();
        formData.append("file", files.pdf);

        const pdfRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ebooks/${id}/upload-pdf`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (!pdfRes.ok) throw new Error("Error al subir PDF");
      }

      //  Subir portada
      if (files.portada) {
        const formData = new FormData();
        formData.append("file", files.portada);

        const portadaRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ebooks/${id}/upload-portada`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (!portadaRes.ok) throw new Error("Error al subir portada");
      }

      router.push("/dashboard/ebooks");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "No se pudo actualizar el ebook");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-5">
      <EbookForm
        initialData={ebook}
        onSubmit={handleSubmit}
        loading={saving}
      />
    </div>
  );
}
