"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/${id}`,
          { credentials: "include" }
        );

        if (!res.ok) throw new Error("Error al cargar usuario");

        const data = await res.json();

        setForm({
          name: data.name ?? "",
          email: data.email ?? "",
          role: data.role ?? "",
        });

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleUpdate = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });

    router.push("/dashboard/users");
  };

  const handleDelete = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    router.push("/dashboard/users");
  };

  if (loading)
    return (
      <section className="bg-white py-16 px-6 md:px-20">
        <p className="text-center py-10">Cargando usuario...</p>
      </section>
    );

  return (
    <section className="bg-white py-16 px-6 md:px-20">
      <h2 className="text-3xl font-bold mb-8 text-left text-black">
        Editar usuario #{id}
      </h2>

      <div className="bg-gray-50 shadow-md rounded-2xl p-8 max-w-xl mx-auto">
        <div className="space-y-5">

          <div>
            <label className="block text-black font-semibold mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={form.name || ""}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full border p-2 rounded-lg focus:outline-none text-black"
            />
          </div>

          <div>
            <label className="block text-black font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              value={form.email || ""}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full border p-2 rounded-lg focus:outline-none text-black"
            />
          </div>

          <div>
            <label className="block text-black font-semibold mb-1">
              Rol
            </label>
            <select
              value={form.role || ""}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
              className="w-full border p-2 rounded-lg bg-white text-black"
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <button
            onClick={handleUpdate}
            className="bg-black text-white w-full py-3 rounded-lg hover:bg-white hover:text-black border border-black transition"
          >
            Guardar cambios
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-600 text-white w-full py-3 rounded-lg hover:bg-white hover:text-red-600 border border-red-600 transition"
          >
            Eliminar usuario
          </button>

        </div>
      </div>
    </section>
  );
}
