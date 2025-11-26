"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EbookCard from "@/components/ebooks/EbookCard";

export default function DashboardEbooksPage() {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEbooks = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ebooks?includeInactive=true`
      );
      if (!res.ok) throw new Error("Error fetching ebooks");

      const data = await res.json();
      setEbooks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEbooks();
  }, []);

  if (loading)
    return (
      <p className="text-center text-gray-600 py-10 pt-24">
        Cargando ebooks...
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto p-6 pt-24"> {/* <-- FIX IMPORTANTE */}

      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-black">
          Administrar Ebooks
        </h1>

        <Link
          href="/dashboard/ebooks/nuevo"
          className="bg-black text-white px-5 py-2 rounded-xl hover:bg-white hover:text-black border border-black transition"
        >
          + Nuevo Ebook
        </Link>
      </div>

      {ebooks.length === 0 && (
        <p className="text-center text-gray-600">No hay ebooks disponibles.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {ebooks.map((ebook: any) => (
          <div key={ebook.id} className="relative">

            {!ebook.isActive && (
              <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded">
                Inactivo
              </span>
            )}

            <EbookCard ebook={ebook} />
          </div>
        ))}
      </div>
    </div>
  );
}
