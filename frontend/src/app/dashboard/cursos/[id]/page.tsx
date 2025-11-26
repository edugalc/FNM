/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Curso = {
  id: number;
  titulo: string;
  descripcion: string;
  imagenUrl: string;
  precio: number;
};

export default function CursosDisponiblesPage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCursos = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/curso/ui`);
      const data = await res.json();
      setCursos(data);
    } catch (err) {
      console.error("Error cargando cursos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 text-black">
      <h1 className="text-4xl font-bold mb-8">Cursos Disponibles</h1>

      {loading ? (
        <p className="text-center py-10 text-gray-600">Cargando cursos...</p>
      ) : cursos.length === 0 ? (
        <p className="text-center py-10 text-gray-600">No hay cursos disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cursos.map((curso) => (
            <div
              key={curso.id}
              className="border rounded-2xl shadow hover:shadow-lg transition bg-white"
            >
              <img
                src={curso.imagenUrl}
                alt={curso.titulo}
                className="w-full h-48 object-cover rounded-t-2xl"
              />

              <div className="p-5 flex flex-col gap-3">
                <h2 className="text-xl font-bold">{curso.titulo}</h2>
                <p className="text-gray-700 text-sm line-clamp-3">{curso.descripcion}</p>

                <p className="font-bold text-lg mt-2">${curso.precio}</p>

                <Link
                  href={`/cursos/${curso.id}`}
                  className="mt-3 text-center bg-black text-white py-2 rounded shadow hover:bg-white hover:text-black hover:border hover:border-black transition"
                >
                  Ver detalles
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
