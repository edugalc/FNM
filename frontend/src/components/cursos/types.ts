// components/cursos/types.ts
export type Opcion = {
  id?: number;
  texto: string;
  esCorrecta: boolean;
};

export type Pregunta = {
  id?: number;
  texto: string;
  tipo?: "OPCION_MULTIPLE" | "VERDADERO_FALSO";
  respuestaCorrecta?: string | null;
  opciones?: Opcion[];
};

export type Cuestionario = {
  id?: number;
  preguntas: Pregunta[];
};

export type Video = {
  id?: number;
  titulo: string;
  url: string;
  orden?: number;
};

export type Leccion = {
  id?: number;
  titulo: string;
  contenido?: string | null;
  orden?: number;
  videos?: Video[];
  cuestionario?: Cuestionario | null;
};

export type Seccion = {
  id?: number;
  titulo: string;
  orden?: number;
  lecciones?: Leccion[];
};

export type Curso = {
  id?: number | string;
  titulo: string;
  descripcion?: string | null;
  precio?: number;
  imagenUrl?: string | null;
  secciones: Seccion[];
};
