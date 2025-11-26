"use client";
import Image from "next/image";
import Link from "next/link";

export default function EbookCard({ ebook }: { ebook: any }) {
  let portada = `https://source.unsplash.com/random/400x250?book,${encodeURIComponent(
    ebook.titulo ?? "book"
  )}`;

  if (ebook.portada) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    portada = `${baseUrl}/uploads/ebooks/portadas/${ebook.portada}`;
  }

  return (
    <Link
      href={`/dashboard/ebooks/${ebook.id}`}
      className="block bg-white rounded-2xl shadow-lg overflow-hidden transition transform hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative w-full h-48">
        <Image
          src={portada}
          alt={ebook.titulo}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="p-5">
        <h2 className="text-xl font-bold text-black mb-2">{ebook.titulo}</h2>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {ebook.descripcion || "Sin descripción"}
        </p>
        <p className="font-semibold text-black text-lg mb-4">${ebook.precio}</p>
      </div>
    </Link>
  );
}
