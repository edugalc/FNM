"use client";

import { useState } from "react";

type Opcion = {
  id?: number;
  texto: string;
  esCorrecta?: boolean;
};

type Props = {
  opcion: Opcion;
  onChange: (o: Opcion) => void;
  onRemove: () => void;
};

export default function OpcionForm({ opcion, onChange, onRemove }: Props) {
  const [texto, setTexto] = useState(opcion.texto);
  const [esCorrecta, setEsCorrecta] = useState(opcion.esCorrecta || false);

  return (
   <div className="flex items-center gap-2 mb-2">
  <input
    className="border border-gray-300 rounded-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-gray-300"
    placeholder="Texto de la opción"
    value={texto}
    onChange={(e) => {
      setTexto(e.target.value);
      onChange({ ...opcion, texto: e.target.value, esCorrecta });
    }}
  />
  <label className="flex items-center gap-1">
    <input
      type="checkbox"
      checked={esCorrecta}
      onChange={(e) => {
        setEsCorrecta(e.target.checked);
        onChange({ ...opcion, texto, esCorrecta: e.target.checked });
      }}
    />
    Correcta
  </label>
  <button
    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
    onClick={onRemove}
  >
    Eliminar
  </button>
</div>

  );
}
