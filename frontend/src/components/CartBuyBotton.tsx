"use client";
import { useState } from "react";
interface CartItem {
id: number;
cantidad: number;
ebook: {
id: number;
titulo: string;
precio: number;
};
}

interface PagarCarritoButtonProps {
items: CartItem[];
userId: number;
}

export default function PagarCarritoButton({ items, userId }: PagarCarritoButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/stripe/create-checkout-session`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId,
          items, 
        }),
      }
    );

    const data = await res.json();

    window.location.href = data.url;
  };

  return (
    <button disabled={loading} onClick={handleCheckout}>
      {loading ? "Procesando..." : "Pagar carrito"}
    </button>
  );
}
