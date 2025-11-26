/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/context/AuthContext";

interface Props {
  ebook: any;
  onAddToCart?: (ebookId: number) => Promise<void>;
}

export default function EbookUserCard({ ebook, onAddToCart }: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { token } = useAuth();
  const setCount = useCartStore((state) => state.setCount);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2500);
  };

  const portada = ebook.portada
    ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/ebooks/portadas/${ebook.portada}`
    : `https://source.unsplash.com/random/400x250?book,${encodeURIComponent(
        ebook.titulo ?? "book"
      )}`;

  const handleAdd = async () => {
    if (!onAddToCart) {
      showMessage("Debes iniciar sesión para añadir al carrito");
      return;
    }

    setLoading(true);
    try {
      await onAddToCart(ebook.id);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carrito`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setCount(data.totalItems);
      showMessage("Producto añadido al carrito ");

    } catch (err) {
      console.error("Error al agregar al carrito:", err);
      showMessage("Error al agregar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">

      {message && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black text-white py-2 px-4 rounded-xl text-sm shadow-lg animate-fade">
          {message}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition transform hover:-translate-y-1 hover:shadow-xl">
        <div className="relative w-full h-48">
          <Image
            src={portada}
            alt={ebook.titulo}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="p-5 flex flex-col gap-3">
          <h2 className="text-xl font-bold text-black mb-2">{ebook.titulo}</h2>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {ebook.descripcion || "Sin descripción"}
          </p>
          <p className="font-semibold text-black text-lg mb-2">
            ${ebook.precio.toFixed(2)}
          </p>

          <Link
            href={`/ebooks/${ebook.id}`}
            className="w-full text-center bg-gray-200 hover:bg-gray-300 text-black py-2 px-4 rounded-xl border border-gray-400 transition"
          >
            Ver Detalle
          </Link>

          <button
            onClick={handleAdd}
            className={`py-2 px-4 rounded-xl w-full border transition
            ${onAddToCart
              ? "bg-black hover:bg-white hover:text-black text-white border-black"
              : "bg-gray-300 text-gray-600 border-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Añadiendo..." : "Agregar al carrito"}
          </button>
        </div>
      </div>
    </div>
  );
}
