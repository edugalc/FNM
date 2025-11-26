"use client";

import { useState } from "react";
import LeccionForm from "./LeccionForm";

type Leccion = {
  id?: number;
  titulo: string;
  contenido?: string;
  videos: any[];
  cuestionario?: any;
  orden?: number;
};

type Seccion = {
  id?: number;
  titulo: string;
  lecciones: Leccion[];
  orden?: number;
};

type Props = {
  seccion: Seccion;
  onChange: (s: Seccion) => void;
  onRemove: () => void;
};

export default function SeccionForm({ seccion, onChange, onRemove }: Props) {
  const [titulo, setTitulo] = useState(seccion.titulo);
  const [lecciones, setLecciones] = useState(seccion.lecciones || []);

  const addLeccion = () => {
    const nueva = { titulo: "", contenido: "", videos: [], cuestionario: null };
    setLecciones([...lecciones, nueva]);
    onChange({ ...seccion, titulo, lecciones: [...lecciones, nueva] });
  };

  const handleLeccionChange = (idx: number, updated: Leccion) => {
    const copy = [...lecciones];
    copy[idx] = updated;
    setLecciones(copy);
    onChange({ ...seccion, titulo, lecciones: copy });
  };

  const removeLeccion = (idx: number) => {
    const copy = lecciones.filter((_, i) => i !== idx);
    setLecciones(copy);
    onChange({ ...seccion, titulo, lecciones: copy });
  };

  return (
  <div className="border p-4 rounded-xl mb-4 bg-white shadow-md">
  <div className="flex justify-between mb-2 items-center">
    <input
      className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-300"
      placeholder="Título de sección"
      value={titulo}
      onChange={(e) => {
        setTitulo(e.target.value);
        onChange({ ...seccion, titulo: e.target.value, lecciones });
      }}
    />
    <button
      className="ml-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
      onClick={onRemove}
    >
      Eliminar
    </button>
  </div>

  {/* Lecciones */}
  <div className="ml-4">
    {lecciones.map((l, idx) => (
      <LeccionForm
        key={idx}
        leccion={l}
        onChange={(updated) => handleLeccionChange(idx, updated)}
        onRemove={() => removeLeccion(idx)}
      />
    ))}
    <button
      className="mt-2 bg-black text-white px-3 py-1 rounded hover:bg-white hover:text-black hover:border hover:border-black transition"
      onClick={addLeccion}
    >
      + Añadir Lección
    </button>
  </div>
</div>

  );
}
