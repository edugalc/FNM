"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface Producto {
id: number;
tipo: string;
titulo: string;
precio: number;
}

interface BuyButtonProps {
producto: Producto;
}

export default function BuyButton({ producto }: BuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();

  const handleBuy = async () => {
    if (!user) {
      alert("Debes iniciar sesión para comprar.");
      return;
    }

    setLoading(true);

    const url = `${process.env.NEXT_PUBLIC_API_URL}/stripe/create-checkout-session`;

    const res = await fetch(url, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        tipo: producto.tipo,
        id: producto.id,
        titulo: producto.titulo,
        precio: producto.precio,
        userId: user.id,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Checkout ERROR:", text);
      alert("Error creando checkout");
      setLoading(false);
      return;
    }

    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <button
      disabled={loading}
      onClick={handleBuy}
      className="mt-6 bg-black text-white px-6 py-3 rounded-xl hover:bg-white hover:text-black border border-black transition"
    >
      {loading ? "Redirigiendo..." : "Comprar ahora"}
    </button>
  );
}
