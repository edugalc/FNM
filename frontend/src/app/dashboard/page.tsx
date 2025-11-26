"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!token) {
      router.push("/login");
      return;
    }

    if (user?.role !== "ADMIN") {
      router.push("/dashboard-user");
      return;
    }
  }, [user, token, loading]);

  if (loading || !user) {
    return <p className="p-10">Cargando...</p>;
  }

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold text-gray-900 mb-10">
        Panel de administración
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {/* --- CURSOS --- */}
        <Link
          href="/dashboard/cursos"
          className="bg-white shadow-lg rounded-3xl p-8 hover:shadow-2xl transition cursor-pointer"
        >
          <div className="w-full h-40 relative mb-5 rounded-2xl overflow-hidden">
            <Image
              src="/img/cursos.jpg"
              alt="Cursos"
              fill
              className="object-cover"
            />
          </div>

          <h2 className="text-2xl font-bold mb-3">Cursos</h2>
          <p className="text-gray-600">Crear, editar y administrar cursos.</p>
        </Link>

        {/* --- EBOOKS --- */}
        <Link
          href="/dashboard/ebooks"
          className="bg-white shadow-lg rounded-3xl p-8 hover:shadow-2xl transition cursor-pointer"
        >
          <div className="w-full h-40 relative mb-5 rounded-2xl overflow-hidden">
            <Image
              src="/img/ebooks.jpg"
              alt="Ebooks"
              fill
              className="object-cover"
            />
          </div>

          <h2 className="text-2xl font-bold mb-3">Ebooks</h2>
          <p className="text-gray-600">Crear, editar y administrar ebooks.</p>
        </Link>

        {/* --- USUARIOS --- */}
        <Link
          href="/dashboard/users"
          className="bg-white shadow-lg rounded-3xl p-8 hover:shadow-2xl transition cursor-pointer"
        >
          <div className="w-full h-40 relative mb-5 rounded-2xl overflow-hidden">
            <Image
              src="/img/users.jpg"
              alt="Usuarios"
              fill
              className="object-cover"
            />
          </div>

          <h2 className="text-2xl font-bold mb-3">Usuarios</h2>
          <p className="text-gray-600">
            Crear, editar y administrar usuarios.
          </p>
        </Link>

      </div>
    </div>
  );
}
