"use client";

import { useState } from "react";
import PreguntaForm from "./PreguntaForm";

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

type Cuestionario = {
  preguntas: Pregunta[];
};

type Props = {
  cuestionario: Cuestionario;
  onChange: (c: Cuestionario) => void;
};

export default function CuestionarioForm({ cuestionario, onChange }: Props) {
  const [preguntas, setPreguntas] = useState(cuestionario.preguntas || []);

  const addPregunta = () => {
    const nueva: Pregunta = { texto: "", tipo: "OPCION_MULTIPLE", opciones: [] };
    const copy = [...preguntas, nueva];
    setPreguntas(copy);
    onChange({ preguntas: copy });
  };

  const handlePreguntaChange = (idx: number, updated: Pregunta) => {
    const copy = [...preguntas];
    copy[idx] = updated;
    setPreguntas(copy);
    onChange({ preguntas: copy });
  };

  const removePregunta = (idx: number) => {
    const copy = preguntas.filter((_, i) => i !== idx);
    setPreguntas(copy);
    onChange({ preguntas: copy });
  };

  return (
<div className="border p-4 rounded-xl mb-3 bg-white shadow-sm">
  <h4 className="font-semibold mb-3 text-gray-800">Cuestionario</h4>
  {preguntas.map((p, idx) => (
    <PreguntaForm
      key={idx}
      pregunta={p}
      onChange={(updated) => handlePreguntaChange(idx, updated)}
      onRemove={() => removePregunta(idx)}
    />
  ))}
  <button
    className="mt-3 bg-black text-white px-3 py-1 rounded hover:bg-white hover:text-black hover:border hover:border-black transition"
    onClick={addPregunta}
  >
    + Añadir Pregunta
  </button>
</div>

  );
}
