"use client";

import { useEffect, useState } from "react";
import CursoForm from "@/components/cursos/CursoForm";
import CursoCard from "@/components/cursos/CursoCard";
import { Curso } from "@/components/cursos/types";
import { useAuth } from "@/context/AuthContext";

export default function DashboardCursosPage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Curso | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Curso | null>(null);

  const { token } = useAuth();

  const fetchCursos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/curso/ui`);
      if (!res.ok) throw new Error("Error fetching");
      const data = await res.json();
      setCursos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  const handleSaved = () => {
    fetchCursos();
    setEditing(null);
    setCreating(false);
  };

  const loadFullCurso = async (id: number) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/curso/${id}`);
      if (!res.ok) throw new Error("Error fetching full course");

      const data = await res.json();
      data.secciones = data.secciones ?? [];
      data.secciones = data.secciones.map((s: any) => ({
        ...s,
        lecciones: s.lecciones ?? [],
      }));

      setEditing(data);
    } catch (err) {
      console.error(err);
      alert("No se pudo cargar el curso completo.");
    }
  };

  return (
    <div className="pt-24 px-4 pb-10 max-w-7xl mx-auto">

      <header className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
        <h1 className="text-4xl font-bold text-gray-900 text-center sm:text-left">
          Administración de Cursos
        </h1>

        <div className="flex gap-3 flex-wrap justify-center sm:justify-start">
          <button
            onClick={() => {
              setCreating(true);
              setEditing(null);
            }}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-white hover:text-black border transition"
          >
            Crear curso
          </button>

          <button
            onClick={fetchCursos}
            className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Refrescar
          </button>
        </div>
      </header>

      {/* Crear curso */}
      {creating && (
        <div className="mb-8 bg-gray-50 p-6 rounded-2xl shadow-lg border">
          <CursoForm onSaved={handleSaved} onCancel={() => setCreating(false)} />
        </div>
      )}

      {/* Editar curso */}
      {editing && (
        <div className="mb-8 bg-gray-50 p-6 rounded-2xl shadow-lg border">
          <CursoForm
            initialData={editing}
            onSaved={handleSaved}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      {/* Lista de cursos */}
      <section>
        {loading ? (
          <p className="text-center py-12 text-gray-500 text-lg animate-pulse">
            Cargando cursos...
          </p>
        ) : cursos.length === 0 ? (
          <p className="text-center py-12 text-gray-600 text-lg">
            No hay cursos disponibles.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {cursos.map((c) => (
              <div
                key={c.id}
                className="bg-white p-4 rounded-2xl shadow-md flex flex-col border hover:shadow-xl transition"
              >
                <CursoCard curso={c} />

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => loadFullCurso(c.id!)}
                    className="w-full bg-black text-white py-2 rounded-lg hover:bg-white hover:text-black border transition"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => setDeleteTarget(c)}
                    className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MODAL DE CONFIRMACIÓN */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              ¿Eliminar curso?
            </h2>

            <p className="text-gray-600 mb-6">
              Estás a punto de eliminar <strong>{deleteTarget.titulo}</strong>.<br />
              Esta acción no se puede deshacer.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="w-full py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Cancelar
              </button>

              <button
                onClick={async () => {
                  try {
                    const res = await fetch(
                      `${process.env.NEXT_PUBLIC_API_URL}/curso/${deleteTarget.id}`,
                      {
                        method: "DELETE",
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "application/json",
                        },
                      }
                    );

                    if (!res.ok) throw new Error("Error eliminando curso");

                    setDeleteTarget(null);
                    fetchCursos();
                  } catch (err) {
                    console.error(err);
                    alert("No se pudo eliminar el curso.");
                  }
                }}
                className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
