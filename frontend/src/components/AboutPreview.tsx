"use client";

import { motion } from "framer-motion";

export default function AboutPreview() {
  return (
    <section
      className="relative py-32 bg-cover bg-center"
      style={{ backgroundImage: "url('/img/about-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-white/70 backdrop-blur-md"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative max-w-4xl mx-auto text-center px-6"
      >
        <h2 className="text-4xl font-bold mb-6 text-black" >Sobre Femeninamente</h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          Femeninamente es un espacio creado para acompañar el crecimiento
          emocional, espiritual y personal de la mujer a través de cursos,
          ebooks, herramientas prácticas y contenido transformador.
        </p>
      </motion.div>
    </section>
  );
}
