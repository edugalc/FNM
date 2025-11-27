"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  const showToast = (message: string, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const email = String(formData.email || "").trim();
    const password = String(formData.password || "").trim();

    if (!email) {
      showToast("El correo es obligatorio");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast("Ingresa un correo válido");
      return false;
    }

    if (!password) {
      showToast("La contraseña es obligatoria");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const email = String(formData.email || "");
      const password = String(formData.password || "");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), 
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        console.log("ERROR LOGIN:", data);
        showToast(data.message || "Credenciales incorrectas");
        return;
      }

      login(data);

      router.push(data.role === "admin" ? "/dashboard" : "/dashboard-user");

    } catch (error) {
      console.error(error);
      showToast("Ocurrió un error inesperado. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto relative">

      {toast && (
<div
  className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg text-white z-[9999] transition
  ${toast.type === "error" ? "bg-red-600" : "bg-green-600"}`}
>
  {toast.message}
</div>

      )}

      <div className="bg-white rounded-3xl shadow-lg p-10">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-black">
          Inicia sesión
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <label className="text-gray-700 font-semibold">Correo Electrónico</label>
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
            className="border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900"
          />
          <label className="text-gray-700 font-semibold">Contraseña</label>

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
            className="border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900"
          />

          <button
            type="submit"
            disabled={loading}
            className={`mt-6 bg-black text-white px-6 py-3 rounded-xl hover:bg-white hover:text-black border border-black transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Ingresando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
