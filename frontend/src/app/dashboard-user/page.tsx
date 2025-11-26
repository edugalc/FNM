/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";

export default function DashboardUserPage() {
  const { token } = useAuth();
  const [cursos, setCursos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchCursos = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/curso/mis-cursos`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        console.log("🔥 DATA RECIBIDA:", data);

        setCursos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error al cargar cursos del usuario", err);
        setCursos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, [token]);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 animate-pulse pt-24">
        Cargando tus cursos...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto text-black pt-24">
      {/* TÍTULO */}
      <h1 className="text-4xl font-extrabold mb-10 text-center tracking-tight">
        Mis Cursos
      </h1>

      {/* SIN CURSOS */}
      {cursos.length === 0 ? (
        <div className="text-gray-500 text-center text-lg">
          No estás inscrito en ningún curso aún.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cursos.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-gray-200 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* IMAGEN DEL CURSO */}
              {item.curso.imagenUrl && (
                <div className="relative w-full h-44 overflow-hidden">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}${item.curso.imagenUrl}`}
                    alt={item.curso.titulo}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              )}

              {/* CONTENIDO */}
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2 line-clamp-1">
                  {item.curso.titulo}
                </h2>

                <p className="text-gray-600 text-sm line-clamp-2">
                  {item.curso.descripcion}
                </p>

                <div className="mt-6 flex justify-end">
                  <Link
                    href={`/dashboard-user/cursos/${item.cursoId}`}
                    className="rounded-xl px-6 py-2 border border-black text-sm font-medium
                    hover:bg-black hover:text-white transition-all duration-300"
                  >
                    Ir al curso
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
