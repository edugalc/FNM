/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function PagoCancelPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState("Verificando pago...");

  useEffect(() => {
    if (!sessionId) return;

    const verify = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/stripe/verify?session_id=${sessionId}`
      );

      const data = await res.json();

      if (data.pago) {
        setStatus(" Pago confirmado. Ya puedes acceder a tu compra.");
      } else {
        setStatus(" Esperando confirmación del pago...");
      }
    };

    verify();
  }, [sessionId]);

  return (
    <div className="max-w-xl mx-auto text-center mt-20">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Pago Cancelado </h1>
      <p className="text-lg">Tu pago fue cancelado. Puedes intentar de nuevo cuando quieras.</p>

      
       <Link href={`/`}>
                  <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-white hover:text-black transition my-10">
                      Inicio
                  </button>
                </Link>
    </div>
  );
}

