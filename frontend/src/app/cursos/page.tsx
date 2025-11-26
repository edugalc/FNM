"use client";

import { useEffect, useState } from "react";
import { Curso } from "@/components/cursos/types";
import Link from "next/link";
import Image from "next/image";

export default function CursosPage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCursos = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/curso/ui`);
      if (!res.ok) throw new Error("Error fetching courses");
      const data = await res.json();
      setCursos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  if (loading)
    return (
      <p className="text-center text-gray-600 py-10">Cargando cursos...</p>
    );

  if (cursos.length === 0)
    return (
      <p className="text-center text-gray-600 py-10">
        No hay cursos disponibles.
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto p-6 pt-24">
      {/* Título mejorado */}
      <h1 className="text-5xl font-extrabold text-black text-center mb-12 tracking-tight">
        Cursos Disponibles
      </h1>

      {/* Grid de cursos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {cursos.map((curso) => {
          const imageSrc = curso.imagenUrl
            ? `${process.env.NEXT_PUBLIC_API_URL}${curso.imagenUrl}`
            : `https://source.unsplash.com/random/400x250?education,${encodeURIComponent(
                (curso.titulo || "").trim()
              )}`;

          return (
            <Link
              href={`/cursos/${curso.id}`}
              key={curso.id}
              className="group block bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200"
            >
              <div className="relative w-full h-52 overflow-hidden">
                <Image
                  src={imageSrc}
                  alt={curso.titulo}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* overlay sutil */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition"></div>
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold text-black mb-2 line-clamp-1">
                  {curso.titulo}
                </h2>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {curso.descripcion}
                </p>

                <p className="font-semibold text-black text-xl mb-6">
                  ${curso.precio}
                </p>

                <button className="w-full bg-black text-white py-2.5 text-sm rounded-xl border border-black transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:shadow-md">
                  Ver Curso
                </button>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
