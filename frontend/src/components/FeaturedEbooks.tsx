"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface Ebook {
id: number;
titulo: string;
portada?: string;
}

export default function FeaturedEbooks() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ebooks`);
        const data = await res.json();

        setEbooks(data);
      } catch (err) {
        console.error("Error cargando ebooks destacados:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEbooks();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white text-black">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-14">
            eBooks Destacados
          </h2>
          <p className="text-gray-500">Cargando ebooks...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white text-black">
      <div className="max-w-6xl mx-auto px-6">

        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
          eBooks Destacados
        </h2>

        {ebooks.length === 0 ? (
          <p className="text-center text-gray-500">
            Aún no hay ebooks disponibles.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {ebooks.map((ebook) => (
              <motion.div
                key={ebook.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="shadow-lg bg-white rounded-3xl overflow-hidden"
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/ebooks/portadas/${ebook.portada}`}
                  width={500}
                  height={600}
                  className="w-full h-64 object-cover"
                  alt={ebook.titulo}
                />
                <div className="p-6">
                  <h3 className="font-bold text-xl">{ebook.titulo}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
