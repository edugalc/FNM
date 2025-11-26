"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return <p className="text-center py-10">Cargando usuarios...</p>;

  return (
    <section className="bg-white py-16 px-6 md:px-20">
      <h2 className="text-3xl font-bold mb-8 text-left text-black">
        Usuarios registrados
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((u) => (
          <div
            key={u.id}
            className="bg-gray-50 shadow-md rounded-2xl p-6 hover:shadow-xl transition flex flex-col"
          >
            <h3 className="text-xl font-semibold mb-2 text-black">
              {u.nombre}
            </h3>

            <p className="text-gray-600 mb-1">
              <strong>Email:</strong> {u.email}
            </p>

            <p className="text-gray-600 mb-4">
              <strong>Rol:</strong>{" "}
              <span className="capitalize font-semibold">{u.role}</span>
            </p>

            <Link href={`/dashboard/users/${u.id}`} className="mt-auto">
              <button className="bg-black text-white w-full py-2 rounded-lg hover:bg-white hover:text-black border border-black transition">
                Ver detalles
              </button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
