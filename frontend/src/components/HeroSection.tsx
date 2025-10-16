"use client";

import { useState } from "react";
import RegisterForm from "@/components/RegisterForm";

export default function HeroSection() {
  const [showForm, setShowForm] = useState(false);

  return (
    <section className="bg-white text-black py-24 px-6 text-left md:px-20 relative">
      <div className="max-w-3xl">
        <h1 className="text-5xl font-bold mb-6 leading-tight">
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
            className="inline-block bg-black text-white rounded-md px-8 py-3 font-medium hover:bg-white hover:text-black border border-black transition-colors"
          >
            Únete
          </button>
          <a
            href="#"
            className="inline-block text-black border border-black rounded-md px-8 py-3 font-medium hover:bg-black hover:text-white transition-colors"
          >
            Conoce más
          </a>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          Desde 2012 acompañando a mujeres en su proceso de sanación y crecimiento personal.
        </p>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>
            <RegisterForm />
          </div>
        </div>
      )}
    </section>
  );
}
