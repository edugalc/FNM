"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import SeccionForm from "@/components/cursos/SeccionForm";
import { Curso } from "@/components/cursos/types";
import AlertMessage from "@/components/AlertMessage";

type Props = {
  initialData?: Curso;
};

export default function CursoFormPage({ initialData }: Props) {
  const { token } = useAuth();
  const router = useRouter();

  const [titulo, setTitulo] = useState(initialData?.titulo || "");
  const [descripcion, setDescripcion] = useState(initialData?.descripcion || "");
  const [precio, setPrecio] = useState(initialData?.precio || 0);
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [imagenUrl, setImagenUrl] = useState(initialData?.imagenUrl || "");
  const [secciones, setSecciones] = useState(initialData?.secciones || []);
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  if (token === null) return <div className="py-10 text-center">Cargando...</div>;

  const handleAddSeccion = () => {
    setSecciones([...secciones, { titulo: "", orden: secciones.length + 1, lecciones: [] }]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImagenFile(e.target.files[0]);
      setImagenUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const saveCurso = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("descripcion", descripcion);
      formData.append("precio", precio.toString());
      formData.append("secciones", JSON.stringify(secciones));

      if (imagenFile) formData.append("imagen", imagenFile);
      else if (imagenUrl) formData.append("imagenUrl", imagenUrl);

      const method = initialData?.id ? "PATCH" : "POST";
      const url = initialData?.id
        ? `${process.env.NEXT_PUBLIC_API_URL}/curso/${initialData.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/curso`;

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error response from API:", data);
        setAlert({
          type: "error",
          message: data?.message || "Error al guardar curso",
        });
        return;
      }

      if (!initialData?.id) {
        setAlert({
          type: "success",
          message: "Curso creado correctamente",
        });
        router.push(`/dashboard/cursos`);
      } else {
        setTitulo(data.titulo);
        setDescripcion(data.descripcion);
        setPrecio(data.precio);
        setImagenUrl(data.imagenUrl || imagenUrl);
        setSecciones(data.secciones || secciones);

        setAlert({
          type: "success",
          message: "Curso actualizado correctamente",
        });
      }
    } catch (err) {
      console.error(err);
      setAlert({
        type: "error",
        message: "Error en el servidor",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {alert && (
        <AlertMessage
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/*  FIX PARA LA NAVBAR */}
      <div className="pt-24 max-w-4xl mx-auto py-10 text-black">
        {/* ↑↑↑ ESTE PT-24 SOLUCIONA TODO */}

        <h1 className="text-4xl font-bold mb-8 text-black">
          {initialData ? "Editar Curso" : "Crear Curso"}
        </h1>

        <div className="bg-white p-8 rounded-2xl shadow-md flex flex-col gap-6">
          <input
            type="text"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />

          <textarea
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={4}
            className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />

          <input
            type="number"
            placeholder="Precio"
            value={precio}
            onChange={(e) => setPrecio(Number(e.target.value))}
            className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border border-gray-300 rounded-xl p-2"
          />

          {imagenUrl && (
            <img src={imagenUrl} alt="Preview" className="w-48 h-32 object-cover rounded mt-2" />
          )}

          <h2 className="text-2xl font-bold mt-4 mb-2">Secciones</h2>

          {secciones.map((s, idx) => (
            <SeccionForm
              key={idx}
              seccion={s}
              onChange={(updated) => {
                const copy = [...secciones];
                copy[idx] = updated;
                setSecciones(copy);
              }}
              onRemove={() => setSecciones(secciones.filter((_, i) => i !== idx))}
            />
          ))}

          <button
            onClick={handleAddSeccion}
            className="mt-2 bg-black text-white px-4 py-2 rounded hover:bg-white hover:text-black hover:border hover:border-black transition"
          >
            + Añadir Sección
          </button>

          <button
            onClick={saveCurso}
            disabled={loading}
            className={`mt-6 w-full py-3 rounded-xl text-white text-lg transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-white hover:text-black hover:border hover:border-black"
            }`}
          >
            {loading ? "Guardando..." : initialData ? "Guardar Cambios" : "Crear Curso"}
          </button>
        </div>
      </div>
    </>
  );
}
