/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import EbookCarousel from "@/components/ebooks/EbookCarousel";
import { useAuth } from "@/context/AuthContext";
import BuyButton from "@/components/BuyBotton";
import { useCartStore } from "@/store/cartStore";

export default function EbookDetailPage() {
  const { id } = useParams();
  const [ebook, setEbook] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const { token } = useAuth();
  const setCount = useCartStore((state) => state.setCount);

  const fetchEbook = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ebooks/${id}`);
      if (!res.ok) throw new Error("Ebook no encontrado");
      const data = await res.json();
      setEbook(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEbook();
  }, [id]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleAddToCart = async () => {
    if (!token) {
      showToast("Debes iniciar sesión para añadir al carrito");
      return;
    }

    setAdding(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carrito/agregar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ebookId: ebook.id }),
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carrito`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCount(data.totalItems);

      showToast("¡Ebook añadido al carrito!");
    } catch (err) {
      console.error(err);
      showToast("No se pudo añadir al carrito");
    } finally {
      setAdding(false);
    }
  };

  if (loading)
    return (
      <p className="text-center text-gray-600 py-16 animate-pulse">
        Cargando ebook...
      </p>
    );

  if (!ebook)
    return (
      <p className="text-center text-gray-600 py-10">Ebook no encontrado.</p>
    );

  const portada = ebook.portada
    ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/ebooks/portadas/${ebook.portada}`
    : `https://source.unsplash.com/random/600x400?book,${encodeURIComponent(
        ebook.titulo ?? "book"
      )}`;

 return (
  <div className="relative min-h-screen pt-32 pb-20 px-6">
    {/* Fondo degradado */}
    <div className="absolute inset-0 bg-gradient-to-b from-white via-pink-50/40 to-white pointer-events-none" />

    {/* Patrón elegante */}
    <div className="absolute inset-0 opacity-[0.15] bg-[url('/img/pattern-soft.png')] bg-repeat" />

    {/* Toast */}
    {toast && (
      <div className="fixed top-8 right-8 bg-black text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-fadeIn">
        {toast}
      </div>
    )}

    <style jsx>{`
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-6px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-fadeIn {
        animation: fadeIn 0.3s ease-out;
      }
    `}</style>

    {/* Contenido */}
    <div className="relative max-w-6xl mx-auto space-y-16 z-10">
      {/* Card principal */}
      <div className="flex flex-col md:flex-row bg-white/70 backdrop-blur-xl shadow-xl rounded-3xl overflow-hidden border border-pink-100">
        {/* Imagen */}
        <div className="relative w-full md:w-1/3 h-80 md:h-auto flex-shrink-0">
          <Image
            src={portada}
            alt={ebook.titulo}
            fill
            className="object-cover rounded-2xl md:rounded-l-3xl shadow-md border border-pink-100"
            unoptimized
          />
        </div>

        {/* Info */}
        <div className="flex-1 p-10 flex flex-col justify-between">
          <div className="space-y-5">
            <h1 className="text-5xl font-semibold text-gray-900 leading-tight">
              {ebook.titulo}
            </h1>

            <p className="text-gray-600 text-lg leading-relaxed">
              {ebook.descripcion || "Sin descripción disponible."}
            </p>

            <p className="text-gray-800 font-medium">
              Autor:{" "}
              <span className="text-black font-semibold">
                {ebook.autor || "Desconocido"}
              </span>
            </p>
          </div>

          {/* Precio y botones */}
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <span className="text-4xl font-bold text-black">
              ${ebook.precio.toFixed(2)}
            </span>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* Comprar ahora */}
              <div className="w-full sm:w-auto">
                <BuyButton
                  producto={{
                    tipo: "EBOOK",
                    id: ebook.id,
                    titulo: ebook.titulo,
                    precio: ebook.precio,
                  }}
                />
              </div>

              {/* Añadir al carrito */}
<button
  onClick={handleAddToCart}
  disabled={adding}
  className={`w-full sm:w-auto px-6 py-3 rounded-xl text-base font-medium border border-black transition mt-6 ${
    token
      ? "bg-black text-white hover:bg-white hover:text-black"
      : "bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed"
  }`}
>
  {adding ? "Añadiendo..." : "Añadir al carrito"}
</button>



            </div>
          </div>
        </div>
      </div>

      {/* Carrusel */}
      <EbookCarousel />
    </div>
  </div>
);

}
