"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="py-28 bg-black text-white text-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-4xl font-bold mb-6">
          ¿Lista para comenzar tu transformación?
        </h2>

        <p className="text-gray-300 mb-10 max-w-xl mx-auto">
          Únete hoy y comienza a explorar cursos y contenido diseñado para ti.
        </p>

        <Link
          href="/register"
          className="px-10 py-4 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition"
        >
          Únete ahora
        </Link>
      </motion.div>
    </section>
  );
}
