'use client';
import Image from 'next/image';
import { Curso } from './types';


export default function CursoCard({ curso }: { curso: Curso }) {
return (
<div className="bg-white rounded-2xl shadow-md overflow-hidden">
<div className="w-full h-48 relative">
<Image
src={
curso.imagenUrl
? `${process.env.NEXT_PUBLIC_API_URL}${curso.imagenUrl}`
: `https://source.unsplash.com/random/400x250?education,${encodeURIComponent((curso.titulo||'').trim())}`
}
alt={curso.titulo}
fill
className="object-cover"
/>
</div>


<div className="p-4">
<h4 className="text-lg font-semibold text-black">{curso.titulo}</h4>
<p className="text-sm text-gray-600 line-clamp-3">{curso.descripcion}</p>
<div className="mt-3 flex items-center justify-between">
<span className="font-bold text-black">${(curso.precio||0).toFixed(2)}</span>
</div>
</div>
</div>
);
}