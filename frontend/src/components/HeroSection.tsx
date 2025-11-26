"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import RegisterForm from "@/components/RegisterForm";

export default function HeroSection() {
  const [showForm, setShowForm] = useState(false);

  return (
    <section className="relative py-28 px-6 md:px-20 overflow-hidden">

      {/* --- Fondo suave --- */}
      <div className="absolute inset-0 bg-[url('/img/pattern-soft.png')] opacity-10 pointer-events-none"></div>

      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

        {/* --- COLUMNA IZQUIERDA --- */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >
          <h1 className="text-5xl font-bold mb-6 leading-tight text-black">
            Sanar y crecer desde el corazón
          </h1>

          <p className="text-lg text-gray-700 mb-10">
            En Femenina-Mente te acompañamos a fortalecer tu bienestar emocional 
            a través de psicoterapia, educación emocional y herramientas prácticas 
            con enfoque humano y científico.
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => setShowForm(true)}
              className="inline-block bg-black text-white rounded-md px-8 py-3 font-medium border border-black 
              hover:bg-white hover:text-black transition-all hover:scale-[1.03]"
            >
              Únete
            </button>

            <a
              href="#"
              className="inline-block text-black border border-black rounded-md px-8 py-3 font-medium 
              hover:bg-black hover:text-white transition-all hover:scale-[1.03]"
            >
              Conoce más
            </a>
          </div>

          <p className="text-sm text-gray-500 mt-8">
            Desde 2012 acompañando a mujeres en su proceso de sanación y crecimiento personal.
          </p>
        </motion.div>

        {/* --- COLUMNA DERECHA: IMAGEN --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full flex justify-center md:justify-end"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-xl">
            <Image
              src="/img/hero-femeninamente.jpg"
              width={600}
              height={700}
              alt="Bienestar emocional"
              className="object-cover rounded-3xl"
            />

            {/* Sombra rosada suave */}
            <div className="absolute inset-0 bg-pink-200 opacity-10 mix-blend-soft-light"></div>
          </div>
        </motion.div>
      </div>

      {/* --- MODAL MEJORADO --- */}
      {showForm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-30 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full relative"
          >
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>

            <RegisterForm />
          </motion.div>
        </div>
      )}
    </section>
  );
}
