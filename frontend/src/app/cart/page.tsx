"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useCartStore } from "@/store/cartStore";

interface CartItem {
  id: number;
  cantidad: number;
  ebook: {
    id: number;
    titulo: string;
    portada?: string;
    precio: number;
  };
}

export default function CartPage() {
  const { token } = useAuth();
  const setCount = useCartStore((state) => state.setCount);

  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);
  const [removing, setRemoving] = useState<number | null>(null);

  const fetchCart = async () => {
    if (!token) return;

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carrito`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      const cartItems = data.items ?? [];

      setItems(cartItems);

      const totalCount = cartItems.reduce(
        (acc: number, item: CartItem) => acc + item.cantidad,
        0
      );
      setCount(totalCount);
    } catch (err) {
      console.error("Error cargando carrito:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, [token]);


  const updateQuantity = async (ebookId: number, cantidad: number) => {
    if (cantidad < 1) return;

    setProcessing(ebookId);

    setItems((prev) =>
      prev.map((item) =>
        item.ebook.id === ebookId ? { ...item, cantidad } : item
      )
    );

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/carrito/update/ebook/${ebookId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cantidad }),
        }
      );

      if (!res.ok) throw new Error("Error al actualizar");

      const totalCount = items.reduce(
        (acc, item) =>
          acc +
          (item.ebook.id === ebookId ? cantidad : item.cantidad),
        0
      );
      setCount(totalCount);

    } catch (err) {
      console.error(err);
      fetchCart(); 
    }

    setProcessing(null);
  };


  const removeItem = async (ebookId: number) => {
    setRemoving(ebookId);

    const newItems = items.filter((item) => item.ebook.id !== ebookId);
    setItems(newItems);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/carrito/remove/ebook/${ebookId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Error eliminando");

      const totalCount = newItems.reduce(
        (acc, item) => acc + item.cantidad,
        0
      );
      setCount(totalCount);

    } catch (err) {
      console.error(err);
      fetchCart(); 
    }
  };


  const total = items.reduce(
    (acc, item) => acc + item.ebook.precio * item.cantidad,
    0
  );


  if (loading)
    return (
      <p className="text-center py-10 text-gray-600">Cargando carrito...</p>
    );

  if (items.length === 0)
    return (
      <p className="text-center py-10 text-gray-600">Tu carrito está vacío</p>
    );


  return (
    <div className="max-w-5xl mx-auto p-6 text-black">
      <h1 className="text-3xl font-bold mb-6">Mi Carrito</h1>

      <div className="space-y-6">
        {items.map((item) => {
          const portada = item.ebook.portada
            ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/ebooks/portadas/${item.ebook.portada}`
            : `https://source.unsplash.com/random/200x300?book,${encodeURIComponent(
                item.ebook.titulo
              )}`;

          const isProcessing = processing === item.ebook.id;

          return (
            <div
              key={item.id}
              className={`flex gap-4 bg-white shadow-md rounded-xl overflow-hidden transition-all duration-300
                ${
                  removing === item.ebook.id
                    ? "opacity-0 scale-95"
                    : "opacity-100 scale-100"
                }`}
            >
              <div className="relative w-32 h-40 flex-shrink-0">
                <Image
                  src={portada}
                  alt={item.ebook.titulo}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold">{item.ebook.titulo}</h2>
                  <p className="text-gray-600 text-lg mt-1">
                    ${item.ebook.precio.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <button
                    className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-40"
                    onClick={() =>
                      updateQuantity(item.ebook.id, item.cantidad - 1)
                    }
                    disabled={item.cantidad <= 1 || isProcessing}
                  >
                    -
                  </button>

                  <span>{item.cantidad}</span>

                  <button
                    className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-40"
                    onClick={() =>
                      updateQuantity(item.ebook.id, item.cantidad + 1)
                    }
                    disabled={isProcessing}
                  >
                    +
                  </button>

                  <button
                    className="ml-auto text-red-600 hover:underline disabled:opacity-40"
                    onClick={() => removeItem(item.ebook.id)}
                    disabled={isProcessing}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-between items-center bg-gray-100 p-6 rounded-xl">
        <span className="text-2xl font-bold">Total: ${total.toFixed(2)}</span>

        <button
          className="bg-black hover:bg-white hover:text-black text-white px-6 py-3 rounded-xl border border-black transition"
        >
          Pagar
        </button>
      </div>
    </div>
  );
}
