/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import VideoForm from "./VideoForm";
import CuestionarioForm from "./CuestionarioForm";

type Video = {
  id?: number;
  titulo: string;
  url: string;
  orden?: number;
};

type Pregunta = {
  id?: number;
  texto: string;
  tipo?: string;
  opciones?: any[];
  respuestaCorrecta?: string;
};

type Cuestionario = {
  preguntas: Pregunta[];
};

type Leccion = {
  id?: number;
  titulo: string;
  contenido?: string | null;
  videos: Video[];
  cuestionario?: Cuestionario;
};

type Props = {
  leccion: Leccion;
  onChange: (l: Leccion) => void;
  onRemove: () => void;
};

export default function LeccionForm({ leccion, onChange, onRemove }: Props) {
  const [titulo, setTitulo] = useState(leccion.titulo);
  const [contenido, setContenido] = useState(leccion.contenido || "");
  const [videos, setVideos] = useState(leccion.videos || []);
const [cuestionario, setCuestionario] = useState({
  preguntas: leccion.cuestionario?.preguntas?.map(p => ({
    ...p,
    opciones: p.opciones || [], 
  })) || [],
});

  const addVideo = () => {
    const nueva = { titulo: "", url: "" };
    setVideos([...videos, nueva]);
    onChange({ ...leccion, titulo, contenido, videos: [...videos, nueva], cuestionario });
  };

  return (
<div className="border p-3 rounded-xl mb-3 bg-white shadow-md">
  <div className="flex justify-between mb-2 items-center">
    <input
      className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-300"
      placeholder="Título de lección"
      value={titulo}
      onChange={(e) => {
        setTitulo(e.target.value);
        onChange({ ...leccion, titulo: e.target.value, contenido, videos, cuestionario });
      }}
    />
    <button
      className="ml-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
      onClick={onRemove}
    >
      Eliminar
    </button>
  </div>

  <textarea
    className="border border-gray-300 rounded-lg p-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
    placeholder="Contenido"
    value={contenido}
    onChange={(e) => {
      setContenido(e.target.value);
      onChange({ ...leccion, titulo, contenido: e.target.value, videos, cuestionario });
    }}
  />

  {/* Videos */}
  <div className="ml-4">
    {videos.map((v, idx) => (
      <VideoForm
        key={idx}
        video={v}
        onChange={(updated) => {
          const copy = [...videos];
          copy[idx] = updated;
          setVideos(copy);
          onChange({ ...leccion, titulo, contenido, videos: copy, cuestionario });
        }}
        onRemove={() => {
          const copy = videos.filter((_, i) => i !== idx);
          setVideos(copy);
          onChange({ ...leccion, titulo, contenido, videos: copy, cuestionario });
        }}
      />
    ))}
    <button
      className="mt-2 bg-black text-white px-3 py-1 rounded hover:bg-white hover:text-black hover:border hover:border-black transition"
      onClick={addVideo}
    >
      + Añadir Video
    </button>
  </div>

  {/* Cuestionario */}
  <div className="ml-4 mt-2">
    <CuestionarioForm
      cuestionario={cuestionario}
      onChange={(updated) => {
        setCuestionario(updated);
        onChange({ ...leccion, titulo, contenido, videos, cuestionario: updated });
      }}
    />
  </div>
</div>

  );
}
