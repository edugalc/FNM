"use client";

import { useEffect, useState } from "react";
import Slider from "react-slick";
import Image from "next/image";

type Course = {
  id: string;
  titulo: string;
  descripcion: string;
  precio: number;
  imagen?: string; // si usas una url de imagen
};

export default function LastCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  useEffect(() => {
    fetch("http://localhost:3001/curso/ui") 
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar cursos:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center py-10">Cargando cursos...</p>;
  if (!courses.length)
    return <p className="text-center py-10">No hay cursos disponibles.</p>;

  return (
    <section className="bg-white py-16 px-6 md:px-20">
      <h2 className="text-3xl font-bold mb-8 text-left">
        Últimos cursos
      </h2>

      <Slider {...settings}>
        {courses.map((curso) => (
          <div key={curso.id} className="px-2">
            <div className="bg-gray-50 shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition">
              <Image
  src={`https://source.unsplash.com/random/400x250?education,${curso.titulo}`}
  alt={curso.titulo}
  width={400}       // ancho real de la imagen
  height={250}      // alto real de la imagen
  className="w-full h-48 object-cover"
/>
              <div className="p-5 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{curso.titulo}</h3>
                  <p className="text-gray-600 line-clamp-3 mb-3">
                    {curso.descripcion}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-lg font-bold text-black">
                    ${curso.precio.toFixed(2)}
                  </span>
                  <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
                    Ver detalles
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
}
