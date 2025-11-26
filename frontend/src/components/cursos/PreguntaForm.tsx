"use client";

import { useState } from "react";
import OpcionForm from "./OpcionForm";

type Opcion = {
  id?: number;
  texto: string;
  esCorrecta?: boolean;
};

type Pregunta = {
  id?: number;
  texto: string;
  tipo?: string;
  opciones: Opcion[];
  respuestaCorrecta?: string;
};

type Props = {
  pregunta: Pregunta;
  onChange: (p: Pregunta) => void;
  onRemove: () => void;
};

export default function PreguntaForm({ pregunta, onChange, onRemove }: Props) {
  const [texto, setTexto] = useState(pregunta.texto);
  const [opciones, setOpciones] = useState(pregunta.opciones || []);

  const addOpcion = () => {
    const nueva: Opcion = { texto: "", esCorrecta: false };
    const copy = [...opciones, nueva];
    setOpciones(copy);
    onChange({ ...pregunta, texto, opciones: copy });
  };

  const handleOpcionChange = (idx: number, updated: Opcion) => {
    const copy = [...opciones];
    copy[idx] = updated;
    setOpciones(copy);
    onChange({ ...pregunta, texto, opciones: copy });
  };

  const removeOpcion = (idx: number) => {
    const copy = opciones.filter((_, i) => i !== idx);
    setOpciones(copy);
    onChange({ ...pregunta, texto, opciones: copy });
  };

  return (
<div className="border p-3 rounded-xl mb-3 bg-white shadow-sm">
  <div className="flex justify-between mb-2 items-center">
    <input
      className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-300"
      placeholder="Texto de la pregunta"
      value={texto}
      onChange={(e) => {
        setTexto(e.target.value);
        onChange({ ...pregunta, texto: e.target.value, opciones });
      }}
    />
    <button
      className="ml-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
      onClick={onRemove}
    >
      Eliminar
    </button>
  </div>

  <div className="ml-4">
    {opciones.map((o, idx) => (
      <OpcionForm
        key={idx}
        opcion={o}
        onChange={(updated) => handleOpcionChange(idx, updated)}
        onRemove={() => removeOpcion(idx)}
      />
    ))}

    <button
      className="mt-2 bg-black text-white px-3 py-1 rounded hover:bg-white hover:text-black hover:border hover:border-black transition"
      onClick={addOpcion}
    >
      + Añadir Opción
    </button>
  </div>
</div>

  );
}
