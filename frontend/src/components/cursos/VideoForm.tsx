"use client";

import { useState } from "react";

type Video = {
  id?: number;
  titulo: string;
  url: string;
};

type Props = {
  video: Video;
  onChange: (v: Video) => void;
  onRemove: () => void;
};

export default function VideoForm({ video, onChange, onRemove }: Props) {
  const [titulo, setTitulo] = useState(video.titulo);
  const [url, setUrl] = useState(video.url);

  return (
 <div className="border p-3 rounded-xl mb-2 bg-white shadow-sm flex flex-col gap-2">
  <input
    className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-300"
    placeholder="Título del video"
    value={titulo}
    onChange={(e) => {
      setTitulo(e.target.value);
      onChange({ ...video, titulo: e.target.value, url });
    }}
  />
  <input
    className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-gray-300"
    placeholder="URL del video"
    value={url}
    onChange={(e) => {
      setUrl(e.target.value);
      onChange({ ...video, titulo, url: e.target.value });
    }}
  />
  <button
    className="bg-black text-white px-3 py-1 rounded hover:bg-white hover:text-black hover:border hover:border-black w-fit transition"
    onClick={onRemove}
  >
    Eliminar Video
  </button>
</div>

  );
}
