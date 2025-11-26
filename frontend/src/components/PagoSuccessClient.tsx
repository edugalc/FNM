/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import DownloadEbookButton from "@/components/DownloadEbookButton";

interface PagoVerifyResponse {
  message: string;
  pago?: any;
  tipo?: "EBOOK" | "CURSO";
  productId?: number;
}

export default function PagoSuccessClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState("Verificando pago...");
  const [tipo, setTipo] = useState<"EBOOK" | "CURSO" | null>(null);
  const [productId, setProductId] = useState<number | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const verify = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/stripe/verify?session_id=${sessionId}`
        );
        const data: PagoVerifyResponse = await res.json();

        if (data.pago) {
          setStatus("Pago confirmado. ¡Ya puedes acceder a tu compra!");
          setTipo(data.tipo ?? null);
          setProductId(data.productId ?? null);
        } else {
          setStatus("Esperando confirmación del pago...");
        }
      } catch (error) {
        console.error("Error verificando pago:", error);
        setStatus("Error verificando pago. Intenta más tarde.");
      }
    };

    verify();
  }, [sessionId]);

  return (
    <div className="max-w-xl mx-auto text-center mt-20 p-6">
      <h1 className="text-4xl font-bold text-black mb-4">¡Pago exitoso!</h1>
      <p className="text-lg text-gray-700 mb-6">{status}</p>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
        {tipo === "EBOOK" && productId && <DownloadEbookButton ebookId={productId} />}
        {tipo === "CURSO" && productId && (
          <Link href={`/curso/${productId}`}>
            <button className="bg-black text-white px-6 py-3 rounded-xl hover:bg-white hover:text-black border border-black transition">
              Ir al curso
            </button>
          </Link>
        )}
        <Link href={`/dashboard-user`}>
          <button className="bg-gray-800 text-white px-6 py-3 rounded-xl hover:bg-white hover:text-black border border-gray-800 transition">
            Ir a mis compras
          </button>
        </Link>
      </div>
    </div>
  );
}
