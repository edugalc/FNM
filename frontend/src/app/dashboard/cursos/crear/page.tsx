/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import CursoForm from "@/components/cursos/CursoForm";
import { Curso } from "@/components/cursos/types";

export default function CrearEditarCursoPage() {
  const { token } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const cursoId = searchParams.get("id");

  const [initialData, setInitialData] = useState<Curso | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);

  // Redirigir si no hay token
  useEffect(() => {
    if (!token) router.push("/login");
  }, [token]);

  //  Cargar datos del curso si es edición
  useEffect(() => {
    if (!cursoId || !token) return;

    const fetchCurso = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/curso/${cursoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al cargar curso");
        const data = await res.json();
        setInitialData(data);
      } catch (err) {
        console.error(err);
        alert("No se pudo cargar el curso");
        router.push("/dashboard/cursos");
      }
    };

    fetchCurso();
  }, [cursoId, token]);

  if (!token) return <div className="py-10 text-center">Cargando...</div>;

  const handleSaved = (curso: Curso) => {
    router.push(`/dashboard/cursos/${curso.id}`);
  };

  return (
    <div className="pt-24 max-w-4xl mx-auto py-10 px-4">
      
      <h1 className="text-4xl font-bold mb-8 text-gray-900 text-center">
        {initialData ? "Editar Curso" : "Crear Curso"}
      </h1>

      <div className="bg-gray-50 p-6 rounded-2xl shadow-lg">
        <CursoForm initialData={initialData ?? undefined} onSaved={handleSaved} />
      </div>
    </div>
  );
}
