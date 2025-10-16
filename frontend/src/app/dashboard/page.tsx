"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { token, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) router.push("/login");
    else setLoading(false);
  }, [token, router]);

  if (loading) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-3xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Bienvenido a tu perfil</h1>
      <p className="mb-6">Aquí puedes ver tu información y acceder a tus cursos o contenido privado.</p>
      <button
        onClick={logout}
        className="px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
