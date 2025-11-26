"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegisterForm() {
  const router = useRouter();
  const { login } = useAuth(); // ✅ usar login en lugar de setToken

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.message || "Error al registrar");
        return;
      }

      const data = await res.json();

      // ✅ guardar usuario y token en contexto
      login({ user: data.user, token: data.token });

      router.push("/dashboard"); // redirigir al dashboard
    } catch (err) {
      console.error(err);
      alert("Error en el registro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-lg p-10 text-black">
      <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-900">
        Únete a Femenina-Mente
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          type="text"
          name="name"
          placeholder="Nombre completo"
          value={formData.name}
          onChange={handleChange}
          required
          className="border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
        />

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
          className="border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
          className="border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
        />

        <button
          type="submit"
          disabled={loading}
          className={`mt-6 bg-black text-white px-6 py-3 rounded-xl hover:bg-white hover:text-black border border-black transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>
    </div>
  );
}
