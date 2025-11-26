/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import EbookUserCard from "@/components/ebooks/EbookUserCard";
import { useAuth } from "@/context/AuthContext";
import AlertMessage from "@/components/AlertMessage"; 

export default function EbooksPage() {
  const [ebooks, setEbooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  const { token } = useAuth();

  const fetchEbooks = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ebooks`);
      if (!res.ok) throw new Error("Error al cargar ebooks");
      const data = await res.json();
      setEbooks(data);
    } catch (err) {
      console.error(err);
      setAlert({ type: "error", message: "Error al cargar los ebooks." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEbooks();
  }, []);

  const handleAddToCart = async (ebookId: number) => {
    if (!token) {
      setAlert({ type: "info", message: "Debes iniciar sesión para añadir al carrito." });
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carrito/add/ebook/${ebookId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ebookId }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("ERROR STATUS:", res.status);
        console.error("ERROR BODY:", errorText);
        throw new Error("Error al añadir al carrito");
      }

      setAlert({ type: "success", message: "Libro añadido al carrito correctamente" });
    } catch (err) {
      console.error(err);
      setAlert({ type: "error", message: "No se pudo añadir al carrito." });
    }
  };

  if (loading)
    return (
      <p className="text-center text-gray-600 py-16 animate-pulse">
        Cargando ebooks...
      </p>
    );

  if (ebooks.length === 0)
    return (
      <p className="text-center text-gray-600 py-16">
        No hay ebooks disponibles.
      </p>
    );

  return (
      <div className="relative min-h-screen py-16 px-4 pt-32">

      {/* Fondo suave */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-pink-50/40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">

        {/* Título */}
        <h1 className="text-5xl font-bold text-gray-800 text-center mb-14 tracking-tight">
              
           Ebooks Disponibles
        </h1>

        {/* Grid con animación suave */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 animate-fadeIn">
          {ebooks.map((ebook) => (
            <EbookUserCard
              key={ebook.id}
              ebook={ebook}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>

      {alert && (
        <AlertMessage
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
}
