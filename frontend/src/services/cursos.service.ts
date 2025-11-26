export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getCursos() {
  const res = await fetch(`${API_URL}/curso`);
  return res.json();
}

export async function getCurso(id: string) {
  const res = await fetch(`${API_URL}/curso/${id}`);
  return res.json();
}

export async function createCurso(formData: FormData, token: string) {
  const res = await fetch(`${API_URL}/curso`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  return res.json();
}

export async function updateCurso(id: string, formData: FormData, token: string) {
  const res = await fetch(`${API_URL}/curso/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  return res.json();
}

export async function deleteCurso(id: string, token: string) {
  const res = await fetch(`${API_URL}/curso/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}
