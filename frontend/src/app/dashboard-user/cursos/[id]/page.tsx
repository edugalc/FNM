"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import YouTube from "react-youtube";

export default function CursoDetallePage() {
  const { id } = useParams();
  const [curso, setCurso] = useState<any>(null);
  const [seccionActiva, setSeccionActiva] = useState<any>(null);
  const [leccionActiva, setLeccionActiva] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCurso = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/curso/${id}/detalle`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) return console.error("Error HTTP:", res.status);

        const data = await res.json();
        setCurso(data);

        const primeraSeccion = data?.secciones?.[0] || null;
        const primeraLeccion = primeraSeccion?.lecciones?.[0] || null;

        setSeccionActiva(primeraSeccion);
        setLeccionActiva(primeraLeccion);
      } catch (err) {
        console.error("Error cargando curso:", err);
      }
    };

    fetchCurso();
  }, [id]);

  if (!curso)
    return (
      <p className="p-10 text-center text-gray-500 pt-24">Cargando curso...</p>
    );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white text-black pt-24">
      {/* SIDEBAR */}
      <aside className="w-full lg:w-80 border-r border-gray-300 p-6 overflow-y-auto bg-gray-50">
        <h1 className="text-2xl font-bold mb-2">{curso.titulo}</h1>

        {/* Mostrar descripción corta del curso */}
        {curso.descripcion && (
          <p className="text-gray-600 text-sm mb-6 line-clamp-3">
            {curso.descripcion}
          </p>
        )}

        {/* Secciones */}
        <div className="space-y-5">
          {(curso.secciones ?? []).map((sec: any) => (
            <div key={sec.id} className="border-b border-gray-200 pb-2">
              <button
                className="w-full text-left font-semibold py-2 hover:text-black/70 transition-colors"
                onClick={() => {
                  setSeccionActiva(sec);
                  setLeccionActiva(sec.lecciones?.[0] || null);
                }}
              >
                {sec.titulo}
              </button>

              {/* Lecciones */}
              {seccionActiva?.id === sec.id && (
                <div className="mt-2 ml-2 space-y-2">
                  {(sec.lecciones ?? []).map((lec: any) => (
                    <button
                      key={lec.id}
                      onClick={() => setLeccionActiva(lec)}
                      className={`w-full text-left pl-3 py-2 rounded-md transition-all text-sm ${
                        leccionActiva?.id === lec.id
                          ? "bg-black text-white"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      {lec.titulo}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-10 overflow-y-auto">
        {leccionActiva && (
          <div>
            {/* Título */}
            <h2 className="text-3xl font-bold mb-3">{leccionActiva.titulo}</h2>

            {/* Descripción pequeña debajo del título */}
            {leccionActiva.subtitulo && (
              <p className="text-gray-500 mb-4">{leccionActiva.subtitulo}</p>
            )}

            {/* VIDEO */}
            <div className="rounded-xl overflow-hidden shadow-lg mb-8">
              {leccionActiva.videos?.[0] ? (
                <YouTube
                  videoId={extractYouTubeId(leccionActiva.videos[0].url)}
                  className="w-full"
                  opts={{
                    width: "100%",
                    height: "450",
                    playerVars: { autoplay: 0 },
                  }}
                />
              ) : (
                <div className="p-6 text-gray-600">
                  No hay video en esta lección.
                </div>
              )}
            </div>

            {/* CONTENIDO EN TEXTO */}
            {leccionActiva.contenido && (
              <div className="prose max-w-none mb-10">
                <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-line">
                  {leccionActiva.contenido}
                </p>
              </div>
            )}

            {/* MATERIALES DESCARGABLES */}
            {leccionActiva?.materiales?.length > 0 && (
              <div className="mb-10">
                <h3 className="text-xl font-bold mb-3">Materiales</h3>
                <ul className="list-disc ml-6 space-y-1">
                  {leccionActiva.materiales.map((m: any) => (
                    <li key={m.id}>
                      <a
                        href={`${process.env.NEXT_PUBLIC_API_URL}/${m.archivo}`}
                        target="_blank"
                        className="text-black underline hover:text-gray-600"
                      >
                        {m.titulo || "Archivo"}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CUESTIONARIO */}
            {leccionActiva?.cuestionario && (
              <Cuestionario cuestionario={leccionActiva.cuestionario} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function extractYouTubeId(url: string) {
  if (!url) return "";
  const regex =
    /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^"&?/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : "";
}

function Cuestionario({ cuestionario }: any) {
  const [respuestas, setRespuestas] = useState<any>({});
  const [resultado, setResultado] = useState<any>(null);

  const responder = (preguntaId: number, opcionId: number) => {
    setRespuestas((prev: any) => ({ ...prev, [preguntaId]: opcionId }));
  };

  const enviar = () => {
    const aciertos = (cuestionario.preguntas ?? []).filter((preg: any) => {
      const seleccionada = respuestas[preg.id];
      const correcta = preg.opciones.find((o: any) => o.esCorrecta)?.id;
      return seleccionada === correcta;
    }).length;

    setResultado({ correctas: aciertos, total: cuestionario.preguntas.length });
  };

  const reiniciar = () => {
    setRespuestas({});
    setResultado(null);
  };

  return (
    <div className="p-6 bg-white shadow-lg border border-gray-200 rounded-2xl mt-10">
      <h3 className="text-2xl font-semibold mb-6">Cuestionario</h3>

      {(cuestionario.preguntas ?? []).map((pregunta: any) => {
        const opcionCorrecta = pregunta.opciones.find((o: any) => o.esCorrecta);

        return (
          <div
            key={pregunta.id}
            className="mb-8 p-5 bg-gray-50 rounded-xl border border-gray-300"
          >
            <p className="font-semibold mb-4">{pregunta.texto}</p>

            <div className="space-y-2">
              {(pregunta.opciones ?? []).map((opcion: any) => {
                const seleccionada = respuestas[pregunta.id] === opcion.id;
                const esCorrecta = opcion.esCorrecta;
                const mostrar = resultado !== null;

                return (
                  <label
                    key={opcion.id}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                      ${
                        mostrar
                          ? esCorrecta
                            ? "border-green-500 bg-green-100"
                            : seleccionada
                            ? "border-red-500 bg-red-100"
                            : "border-gray-300 bg-white"
                          : seleccionada
                          ? "border-black bg-gray-200"
                          : "border-gray-300 bg-white hover:bg-gray-100"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      disabled={resultado !== null}
                      className="accent-black"
                      name={`preg-${pregunta.id}`}
                      onChange={() => responder(pregunta.id, opcion.id)}
                    />
                    {opcion.texto}
                  </label>
                );
              })}
            </div>

            {resultado !== null &&
              respuestas[pregunta.id] !== opcionCorrecta.id && (
                <p className="mt-3 text-sm text-red-600">
                  Incorrecto. Respuesta correcta:{" "}
                  <span className="font-bold">{opcionCorrecta.texto}</span>
                </p>
              )}

            {resultado !== null &&
              respuestas[pregunta.id] === opcionCorrecta.id && (
                <p className="mt-3 text-sm text-green-600">✔ ¡Correcto!</p>
              )}
          </div>
        );
      })}

      {resultado === null ? (
        <button
          className="px-6 py-3 mt-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all"
          onClick={enviar}
        >
          Enviar respuestas
        </button>
      ) : (
        <div className="mt-6 space-y-4">
          <p className="text-lg font-medium">
            Resultado: {resultado.correctas}/{resultado.total}
          </p>

          <button
            className="px-6 py-3 bg-white border border-black text-black rounded-lg hover:bg-gray-100 transition-all"
            onClick={reiniciar}
          >
            Reintentar
          </button>
        </div>
      )}
    </div>
  );
}
