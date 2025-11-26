"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import BuyButton from "@/components/BuyBotton";

export default function CursoUIPage() {
  const { id } = useParams();
const { user, token } = useAuth();
  const [curso, setCurso] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurso = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/curso/ui/${id}`
      );

      if (!res.ok) throw new Error("Error fetching course details");

      const data = await res.json();
      setCurso(data);
    } catch (err) {
      console.error(err);
      setCurso(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurso();
  }, [id]);

  if (loading)
    return <p className="text-center py-20 text-gray-600">Cargando curso...</p>;

  if (!curso)
    return <p className="text-center py-20 text-red-500">Curso no encontrado</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 relative h-72 rounded-xl overflow-hidden">
          <Image
            src={
              curso.imagenUrl
                ? `${process.env.NEXT_PUBLIC_API_URL}${curso.imagenUrl}`
                : `https://source.unsplash.com/random/600x400?education,${encodeURIComponent(
                    curso.titulo || ""
                  )}`
            }
            alt={curso.titulo}
            fill
            className="object-cover"
          />
        </div>

        <div className="w-full md:w-1/2">
          <h1 className="text-4xl font-bold text-black">{curso.titulo}</h1>

          <p className="mt-3 text-gray-700 text-lg">{curso.descripcion}</p>

          <p className="mt-5 text-3xl font-bold text-black">
            ${curso.precio.toFixed(2)}
          </p>

         <BuyButton
    producto={{
      tipo: "CURSO",
      id: curso.id,
      titulo: curso.titulo,
      precio: curso.precio,
      userId: user?.id,
    }}
  />
        </div>
      </div>
      

      <div className="mt-16">
        <h2 className="text-3xl font-bold text-black mb-6">
          Contenido del Curso
        </h2>

        {curso.secciones?.length === 0 ? (
          <p className="text-gray-600">No hay secciones disponibles aún.</p>
        ) : (
          <div className="space-y-6">
            {curso.secciones.map((seccion: any) => (
              <div
                key={seccion.id}
                className="border border-gray-300 rounded-xl p-5 bg-white shadow-sm"
              >
                <h3 className="text-xl font-semibold text-black mb-3">
                  {seccion.titulo}
                </h3>

                {seccion.lecciones?.length === 0 ? (
                  <p className="text-gray-500">No hay lecciones en esta sección.</p>
                ) : (
                  <ul className="space-y-3">
                    {seccion.lecciones.map((leccion: any) => (
                      <li
                        key={leccion.id}
                        className="p-3 bg-gray-100 rounded-lg border border-gray-300"
                      >
                        <p className="font-semibold text-black">
                          {leccion.titulo}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
