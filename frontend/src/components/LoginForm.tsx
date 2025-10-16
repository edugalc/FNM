"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  const router = useRouter();
  const { setToken } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.message || "Error en login");
        return;
      }

      const data = await res.json();
      setToken(data.token);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-lg p-10">
      <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-900">
        Inicia sesión
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
          className="border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-pink-500 text-white py-3 rounded-xl hover:bg-pink-600 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Ingresando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
