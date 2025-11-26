"use client";

import { useEffect, useState } from "react";
import Slider from "react-slick";
import Image from "next/image";
import Link from "next/link";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type Ebook = {
  id: number;
  titulo: string;
  descripcion?: string;
  portada?: string;
  precio: number;
};

interface Props {
  onAddToCart?: (ebookId: number) => Promise<void>;
  isLoggedIn?: boolean;
}

export default function EbookCarousel({ onAddToCart, isLoggedIn }: Props) {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingIds, setAddingIds] = useState<number[]>([]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ebooks`);
        if (!res.ok) throw new Error("Error al cargar ebooks");
        const data = await res.json();
        setEbooks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEbooks();
  }, []);

  const handleAddToCart = async (ebookId: number) => {
    if (!isLoggedIn || !onAddToCart) {
      alert("Debes iniciar sesión para añadir al carrito");
      return;
    }
    setAddingIds((prev) => [...prev, ebookId]);
    try {
      await onAddToCart(ebookId);
      alert("Ebook añadido al carrito");
    } catch {
      alert("Error al añadir al carrito.");
    } finally {
      setAddingIds((prev) => prev.filter((id) => id !== ebookId));
    }
  };

  if (loading) return <p className="text-center py-10 text-gray-600">Cargando ebooks...</p>;
  if (!ebooks.length)
    return <p className="text-center py-10 text-gray-600">No hay ebooks disponibles.</p>;

  return (
    <section className="bg-white py-16 px-6 md:px-16 lg:px-24">
      <h2 className="text-3xl font-bold mb-10 text-black">Otros ebooks disponibles</h2>

      <Slider {...settings}>
        {ebooks.map((ebook) => {
          const portada = ebook.portada
            ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/ebooks/portadas/${ebook.portada}`
            : `https://source.unsplash.com/random/400x300?book,${encodeURIComponent(
                ebook.titulo.trim()
              )}`;

          const isAdding = addingIds.includes(ebook.id);

          return (
            <div key={ebook.id} className="px-3">
              <div className="bg-gray-50 rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden border border-gray-200">
                
                {/* Imagen */}
                <div className="relative w-full h-64 md:h-72 overflow-hidden">
                  <Image
                    src={portada}
                    alt={ebook.titulo}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    unoptimized
                  />
                </div>

                {/* Contenido */}
                <div className="p-6 flex flex-col h-full gap-3">
                  <h3 className="text-xl font-semibold text-black line-clamp-2">
                    {ebook.titulo}
                  </h3>

                  <p className="text-gray-600 text-sm line-clamp-3">
                    {ebook.descripcion || "Sin descripción"}
                  </p>

                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xl font-bold text-black">${ebook.precio.toFixed(2)}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-4">

                    <Link href={`/ebooks/${ebook.id}`} className="flex-1">
                      <button className="w-full bg-black text-white py-2 rounded-xl text-sm hover:bg-white hover:text-black border border-black transition">
                        Ver detalles
                      </button>
                    </Link>

                    <button
                      onClick={() => handleAddToCart(ebook.id)}
                      disabled={isAdding || !isLoggedIn}
                      className={`w-full sm:flex-1 py-2 rounded-xl text-sm font-medium transition ${
                        isLoggedIn
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {isAdding ? "Añadiendo..." : "Añadir al carrito"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </section>
  );
}
