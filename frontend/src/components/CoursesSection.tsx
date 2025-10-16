"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

type Curso = {
  id: number;
  titulo: string;
  descripcion: string;
  precio?: number;
};

export default function CoursesSection() {
  const [courses, setCourses] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/curso/ui")
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar cursos:", err);
        setError("No se pudieron cargar los cursos. Intenta más tarde.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="bg-white text-black py-24 px-6 md:px-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Cargando cursos...</h2>
          <p className="text-gray-600">Un momento por favor</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white text-black py-24 px-6 md:px-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Oops — algo falló</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              fetch("http://localhost:3001/curso/ui")
                .then((r) => r.json())
                .then((data) => {
                  setCourses(data);
                  setLoading(false);
                })
                .catch((e) => {
                  console.error(e);
                  setError("No se pudieron cargar los cursos. Intenta más tarde.");
                  setLoading(false);
                });
            }}
            className="inline-block bg-black text-white rounded-md px-8 py-3 font-medium hover:bg-white hover:text-black border border-black transition-colors"
          >
            Reintentar
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white text-black py-24 px-6 md:px-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-6 text-left">Cursos disponibles</h2>
        <p className="text-gray-700 mb-12 max-w-3xl">
          Explora nuestros cursos diseñados para el crecimiento personal y la sanación emocional.
        </p>

        {courses.length === 0 ? (
          <p className="text-center text-gray-500">No hay cursos aún.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((curso) => (
              <article
                key={curso.id}
                className="flex flex-col h-full bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden transition hover:shadow-lg"
              >
                <div className="h-48 w-full">
                  <Image
  src={`https://source.unsplash.com/800x450/?therapy,${encodeURIComponent(curso.titulo)}`}
  alt={curso.titulo}
  width={800}      // ancho real de la imagen
  height={450}     // alto real de la imagen
  className="w-full h-full object-cover"
/>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="mb-4">
                    <h3 className="text-2xl font-semibold mb-2">{curso.titulo}</h3>
                    <p className="text-gray-600 text-sm">{curso.descripcion}</p>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-4">
                    <div>
                      <span className="block text-sm text-gray-500">Desde</span>
                      <span className="text-xl font-bold text-black">
                        ${curso.precio?.toFixed(2) ?? "0.00"}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <a
                        href="#"
                        className="inline-block bg-black text-white rounded-md px-6 py-2 font-medium hover:bg-white hover:text-black border border-black transition-colors"
                      >
                        Ver detalles
                      </a>
                      <button
                        className="inline-block text-black border border-black rounded-md px-4 py-2 font-medium hover:bg-black hover:text-white transition-colors"
                        onClick={() => alert(`Comprar curso: ${curso.titulo}`)}
                      >
                        Comprar
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
