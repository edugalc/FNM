"use client";

import { motion } from "framer-motion";
import { FaHeart, FaShieldAlt, FaLeaf } from "react-icons/fa";

export default function FeaturesSection() {
  const features = [
    {
      icon: <FaHeart size={32} />,
      title: "Creado para Mujeres",
      desc: "Contenido diseñado especialmente para tu bienestar personal y emocional.",
    },
    {
      icon: <FaShieldAlt size={32} />,
      title: "Plataforma Segura",
      desc: "Accede de forma privada, protegida y en cualquier dispositivo.",
    },
    {
      icon: <FaLeaf size={32} />,
      title: "Crecimiento Auténtico",
      desc: "Cursos y material enfocado en tu desarrollo interno.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">

        <h2 className="text-3xl md:text-4xl font-bold mb-14 text-black">
          ¿Por qué Femeninamente?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="bg-white shadow-lg rounded-3xl p-8 hover:shadow-xl transition"
            >
              <div className="text-black mb-4 flex justify-center">{f.icon}</div>
              <h3 className="font-bold text-xl mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
