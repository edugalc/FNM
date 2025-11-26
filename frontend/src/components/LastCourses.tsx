"use client";

import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import Link from "next/link";

type Course = {
  id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  imagenUrl?: string;
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
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/curso/ui`);
        if (!res.ok) {
          console.error("Error al llamar a la API:", res.status, res.statusText);
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
          console.error("La respuesta de la API no es un array:", data);
          setLoading(false);
          return;
        }
        setCourses(data);
      } catch (err) {
        console.error("Error al cargar cursos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <p className="text-center py-10">Cargando cursos...</p>;
  if (!courses.length)
    return <p className="text-center py-10 bg-black text-white">No hay cursos disponibles.</p>;

  return (
    <section className="bg-white py-16 px-6 md:px-20">
      <h2 className="text-3xl font-bold mb-8 text-left text-black">Nuestros cursos</h2>

      <Slider {...settings}>
        {courses.map((curso) => (
          <div key={curso.id} className="px-2">
            <div className="bg-gray-50 shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition">
             <Image
  src={
    curso.imagenUrl
      ? `${process.env.NEXT_PUBLIC_API_URL}${curso.imagenUrl}`
      : `https://source.unsplash.com/random/400x250?education,${encodeURIComponent(curso.titulo.trim())}`
  }
  alt={curso.titulo}
  width={400}
  height={250}
  className="w-full h-48 object-cover"
/>


              <div className="p-5 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-black">{curso.titulo}</h3>
                  <p className="text-gray-600 line-clamp-3 mb-3">{curso.descripcion}</p>
                </div>
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-lg font-bold text-black">${curso.precio.toFixed(2)}</span>
                <Link href={`/cursos/${curso.id}`}>
                  <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-white hover:text-black transition">
                      Ver detalles
                  </button>
                </Link>

                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
}
