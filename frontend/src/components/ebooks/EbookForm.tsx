"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export interface CreateEbookDto {
  titulo: string;
  descripcion?: string;
  autor?: string;
  precio: number;
  isActive?: boolean;
}

interface EbookFormProps {
  initialData?: any;
  onSubmit: (data: CreateEbookDto, files: { pdf?: File | null; portada?: File | null }) => Promise<void>;
  loading?: boolean;
}

export default function EbookForm({ initialData, onSubmit, loading }: EbookFormProps) {
  const [form, setForm] = useState<CreateEbookDto>({
    titulo: initialData?.titulo ?? "",
    descripcion: initialData?.descripcion ?? "",
    autor: initialData?.autor ?? "",
    precio: initialData?.precio ?? 0,
    isActive: initialData?.isActive ?? true,
  });

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [portadaFile, setPortadaFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "number" ? Number(value) : value }));
  };

  const handleBoolean = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, isActive: e.target.checked }));
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form, { pdf: pdfFile, portada: portadaFile });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6 text-black mt-10"
    >
      <h2 className="text-2xl font-semibold mb-5">
        {initialData ? "Editar Ebook" : "Crear Ebook"}
      </h2>

      <form onSubmit={submitForm} className="space-y-5">
        <input type="text" name="titulo" value={form.titulo} onChange={handleChange} placeholder="Título" required className="w-full border p-2 rounded" />

        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" rows={4} className="w-full border p-2 rounded"></textarea>

        <input type="text" name="autor" value={form.autor} onChange={handleChange} placeholder="Autor" className="w-full border p-2 rounded" />

        <input type="number" name="precio" value={form.precio} onChange={handleChange} placeholder="Precio" required className="w-full border p-2 rounded" />

        <input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)} className="w-full border p-2 rounded bg-gray-50" />

        <input type="file" accept="image/*" onChange={(e) => setPortadaFile(e.target.files?.[0] ?? null)} className="w-full border p-2 rounded bg-gray-50" />

        <div className="flex items-center gap-2">
          <input type="checkbox" checked={form.isActive} onChange={handleBoolean} />
          <label>Activo</label>
        </div>

        <button type="submit" disabled={loading} className="bg-black hover:bg-white hover:text-black text-white py-2 px-4 rounded-xl border border-black w-full">
          {loading ? "Guardando..." : initialData ? "Actualizar Ebook" : "Crear Ebook"}
        </button>
      </form>
    </motion.div>
  );
}
