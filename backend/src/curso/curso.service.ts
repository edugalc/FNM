import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

@Injectable()
export class CursoService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCursoDto) {
    try {
      const createPayload: any = {
        titulo: data.titulo,
        descripcion: data.descripcion,
        precio: data.precio ?? 0,
        imagenUrl: data.imagenUrl ?? undefined,
        secciones: undefined,
      };

      if (Array.isArray(data.secciones) && data.secciones.length > 0) {
        createPayload.secciones = {
          create: data.secciones.map((s) => ({
            titulo: s.titulo ?? '',
            orden: s.orden ?? 0,
            lecciones:
              Array.isArray(s.lecciones) && s.lecciones.length > 0
                ? {
                    create: s.lecciones.map((l) => ({
                      titulo: l.titulo ?? '',
                      contenido: l.contenido ?? null,
                      orden: l.orden ?? 0,
                      videos: Array.isArray(l.videos) && l.videos.length > 0
                      ? { create: l.videos.map((v) => ({ titulo: v.titulo ?? '', url: v.url ?? '', orden: v.orden ?? 0 })) }
                      : undefined,
                    cuestionario: l.cuestionario && Array.isArray(l.cuestionario.preguntas) && l.cuestionario.preguntas.length > 0
                    ? {
                        create: {
                          preguntas: {
                            create: l.cuestionario.preguntas.map((p) => ({
                              texto: p.texto ?? '',
                              tipo: p.tipo ?? undefined,
                              respuestaCorrecta: p.respuestaCorrecta ?? null,
                              opciones: Array.isArray(p.opciones) && p.opciones.length > 0
                                ? { create: p.opciones.map((o) => ({ texto: o.texto ?? '', esCorrecta: !!o.esCorrecta })) }
                                : undefined,
                            })),
                          },
                        },
                      }
                    : undefined,
                })),
              }
            : undefined,
        })),
      };
    }

    const created = await this.prisma.curso.create({
      data: createPayload,
      include: {
        secciones: {
          include: {
            lecciones: {
              include: {
                videos: true,
                cuestionario: { include: { preguntas: { include: { opciones: true } } } },
              },
            },
          },
        },
      },
    });

    return created;
  } catch (err) {
    throw new InternalServerErrorException('Error creando curso');
  }
}


  async findAll() {
    return this.prisma.curso.findMany({
      include: {
        secciones: {
          include: {
            lecciones: {
              include: {
                videos: true,
                cuestionario: { include: { preguntas: { include: { opciones: true } } } },
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const curso = await this.prisma.curso.findUnique({
      where: { id },
      include: {
        secciones: {
          include: {
            lecciones: {
              include: {
                videos: true,
                cuestionario: { include: { preguntas: { include: { opciones: true } } } },
              },
            },
          },
        },
      },
    });
    if (!curso) throw new NotFoundException('Curso no encontrado');
    return curso;
  }



async update(id: number, data: UpdateCursoDto) {
  const existing = await this.prisma.curso.findUnique({
    where: { id },
    include: {
      secciones: {
        include: {
          lecciones: {
            include: {
              videos: true,
              cuestionario: { include: { preguntas: { include: { opciones: true } } } },
            },
          },
        },
      },
    },
  });

  if (!existing) throw new NotFoundException('Curso no encontrado');

  const cursoUpdate: any = {};
  if (data.titulo !== undefined) cursoUpdate.titulo = data.titulo;
  if (data.descripcion !== undefined) cursoUpdate.descripcion = data.descripcion;
  if (data.precio !== undefined) cursoUpdate.precio = data.precio;
  if (data.imagenUrl !== undefined) cursoUpdate.imagenUrl = data.imagenUrl;

  if (data.secciones === undefined) {
    const updated = await this.prisma.curso.update({
      where: { id },
      data: cursoUpdate,
      include: {
        secciones: {
          include: {
            lecciones: {
              include: {
                videos: true,
                cuestionario: { include: { preguntas: { include: { opciones: true } } } },
              },
            },
          },
        },
      },
    });
    return updated;
  }

  const incomingSecciones = Array.isArray(data.secciones) ? data.secciones : [];

  try {
    return await this.prisma.$transaction(async (tx) => {
      if (Object.keys(cursoUpdate).length > 0) {
        await tx.curso.update({ where: { id }, data: cursoUpdate });
      }

      const existingSecciones = existing.secciones || [];
      const existingSeccionIds = existingSecciones.map(s => s.id);
      const incomingSeccionIds = incomingSecciones.filter((s: any) => typeof s.id === 'number').map((s: any) => s.id as number);

      const seccionesToDelete = existingSeccionIds.filter(eid => !incomingSeccionIds.includes(eid));
      if (seccionesToDelete.length) {
        const leccionesToDelete = (await tx.leccion.findMany({ where: { seccionId: { in: seccionesToDelete } }, select: { id: true } })).map(l => l.id);
        if (leccionesToDelete.length) {
          const cuestIds = (await tx.cuestionario.findMany({ where: { leccionId: { in: leccionesToDelete } }, select: { id: true } })).map(c => c.id);
          if (cuestIds.length) {
            await tx.opcion.deleteMany({ where: { pregunta: { cuestionarioId: { in: cuestIds } } } });
            await tx.pregunta.deleteMany({ where: { cuestionarioId: { in: cuestIds } } });
            await tx.cuestionario.deleteMany({ where: { id: { in: cuestIds } } });
          }
          await tx.video.deleteMany({ where: { leccionId: { in: leccionesToDelete } } });
          await tx.leccion.deleteMany({ where: { id: { in: leccionesToDelete } } });
        }
        await tx.seccion.deleteMany({ where: { id: { in: seccionesToDelete } } });
      }

      for (const s of incomingSecciones) {
        if (s.id && typeof s.id === 'number') {
          await tx.seccion.update({
            where: { id: s.id },
            data: {
              titulo: s.titulo ?? undefined,
              orden: s.orden ?? undefined,
            },
          });

          const existingLecciones = await tx.leccion.findMany({ where: { seccionId: s.id }, include: { cuestionario: { include: { preguntas: { include: { opciones: true } } } }, videos: true } });
          const existingLeccionIds = existingLecciones.map(l => l.id);
          const incomingLecciones = Array.isArray(s.lecciones) ? s.lecciones : [];
          const incomingLeccionIds = incomingLecciones.filter((l: any) => typeof l.id === 'number').map((l: any) => l.id as number);
          const leccionesToDelete = existingLeccionIds.filter(lid => !incomingLeccionIds.includes(lid));

          if (leccionesToDelete.length) {
            const cuestIds = (await tx.cuestionario.findMany({ where: { leccionId: { in: leccionesToDelete } }, select: { id: true } })).map(c => c.id);
            if (cuestIds.length) {
              await tx.opcion.deleteMany({ where: { pregunta: { cuestionarioId: { in: cuestIds } } } });
              await tx.pregunta.deleteMany({ where: { cuestionarioId: { in: cuestIds } } });
              await tx.cuestionario.deleteMany({ where: { id: { in: cuestIds } } });
            }
            await tx.video.deleteMany({ where: { leccionId: { in: leccionesToDelete } } });
            await tx.leccion.deleteMany({ where: { id: { in: leccionesToDelete } } });
          }

          for (const l of incomingLecciones) {
            if (l.id && typeof l.id === 'number') {
              await tx.leccion.update({
                where: { id: l.id },
                data: {
                  titulo: l.titulo ?? undefined,
                  contenido: l.contenido ?? undefined,
                  orden: l.orden ?? undefined,
                },
              });

              const existingVideos = await tx.video.findMany({ where: { leccionId: l.id } });
              const existingVideoIds = existingVideos.map(v => v.id);
              const incomingVideos = Array.isArray(l.videos) ? l.videos : [];
              const incomingVideoIds = incomingVideos.filter((v: any) => typeof v.id === 'number').map((v: any) => v.id as number);
              const videosToDelete = existingVideoIds.filter(vid => !incomingVideoIds.includes(vid));
              if (videosToDelete.length) {
                await tx.video.deleteMany({ where: { id: { in: videosToDelete } } });
              }
              for (const v of incomingVideos) {
                if (v.id && typeof v.id === 'number') {
                  await tx.video.update({
                    where: { id: v.id },
                    data: { titulo: v.titulo ?? undefined, url: v.url ?? undefined, orden: v.orden ?? undefined },
                  });
                } else {
                  await tx.video.create({ data: { titulo: v.titulo ?? '', url: v.url ?? '', orden: v.orden ?? 0, leccion: { connect: { id: l.id } } } });
                }
              }

              if (l.cuestionario) {
                const existingCuest = await tx.cuestionario.findUnique({ where: { leccionId: l.id }, include: { preguntas: { include: { opciones: true } } } });
                if (!existingCuest) {
                  await tx.cuestionario.create({
                    data: {
                      leccion: { connect: { id: l.id } },
                      preguntas: {
                        create: (l.cuestionario.preguntas || []).map((p: any) => ({
                          texto: p.texto ?? '',
                          tipo: p.tipo ?? undefined,
                          respuestaCorrecta: p.respuestaCorrecta ?? null,
                          opciones: Array.isArray(p.opciones) && p.opciones.length > 0 ? { create: p.opciones.map((o: any) => ({ texto: o.texto ?? '', esCorrecta: !!o.esCorrecta })) } : undefined,
                        })),
                      },
                    },
                  });
                } else {
                  const preguntasIncoming = Array.isArray(l.cuestionario.preguntas) ? l.cuestionario.preguntas : [];
                  const existingPreguntas = existingCuest.preguntas || [];
                  const existingPreguntaIds = existingPreguntas.map(p => p.id);
                  const incomingPreguntaIds = preguntasIncoming.filter((p: any) => typeof p.id === 'number').map((p: any) => p.id as number);
                  const preguntasToDelete = existingPreguntaIds.filter(pid => !incomingPreguntaIds.includes(pid));
                  if (preguntasToDelete.length) {
                    await tx.opcion.deleteMany({ where: { preguntaId: { in: preguntasToDelete } } });
                    await tx.pregunta.deleteMany({ where: { id: { in: preguntasToDelete } } });
                  }

                  for (const p of preguntasIncoming) {
                    if (p.id && typeof p.id === 'number') {
                      await tx.pregunta.update({
                        where: { id: p.id },
                        data: {
                          texto: p.texto ?? undefined,
                          tipo: p.tipo ?? undefined,
                          respuestaCorrecta: p.respuestaCorrecta ?? undefined,
                        },
                      });

                      const existingOps = await tx.opcion.findMany({ where: { preguntaId: p.id } });
                      const existingOpIds = existingOps.map(o => o.id);
                      const incomingOps = Array.isArray(p.opciones) ? p.opciones : [];
                      const incomingOpIds = incomingOps.filter((o: any) => typeof o.id === 'number').map((o: any) => o.id as number);
                      const opsToDelete = existingOpIds.filter(id => !incomingOpIds.includes(id));
                      if (opsToDelete.length) {
                        await tx.opcion.deleteMany({ where: { id: { in: opsToDelete } } });
                      }
                      for (const o of incomingOps) {
                        if (o.id && typeof o.id === 'number') {
                          await tx.opcion.update({ where: { id: o.id }, data: { texto: o.texto ?? undefined, esCorrecta: !!o.esCorrecta } });
                        } else {
                          await tx.opcion.create({ data: { texto: o.texto ?? '', esCorrecta: !!o.esCorrecta, pregunta: { connect: { id: p.id } } } });
                        }
                      }
                    } else {
                      // crear pregunta nueva con opciones
                      await tx.pregunta.create({
                        data: {
                          texto: p.texto ?? '',
                          tipo: p.tipo ?? undefined,
                          respuestaCorrecta: p.respuestaCorrecta ?? null,
                          cuestionario: { connect: { id: existingCuest.id } },
                          opciones: Array.isArray(p.opciones) && p.opciones.length > 0 ? { create: p.opciones.map((o: any) => ({ texto: o.texto ?? '', esCorrecta: !!o.esCorrecta })) } : undefined,
                        },
                      });
                    }
                  }
                }
              } else {
                const existingCuest = await tx.cuestionario.findUnique({ where: { leccionId: l.id } });
                if (existingCuest) {
                  await tx.opcion.deleteMany({ where: { pregunta: { cuestionarioId: existingCuest.id } } });
                  await tx.pregunta.deleteMany({ where: { cuestionarioId: existingCuest.id } });
                  await tx.cuestionario.delete({ where: { id: existingCuest.id } });
                }
              }
            } else {
              const createdLeccion = await tx.leccion.create({
                data: {
                  titulo: l.titulo ?? '',
                  contenido: l.contenido ?? null,
                  orden: l.orden ?? 0,
                  seccion: { connect: { id: s.id } },
                  videos: Array.isArray(l.videos) && l.videos.length > 0 ? { create: l.videos.map((v: any) => ({ titulo: v.titulo ?? '', url: v.url ?? '', orden: v.orden ?? 0 })) } : undefined,
                },
              });

              if (l.cuestionario && Array.isArray(l.cuestionario.preguntas) && l.cuestionario.preguntas.length > 0) {
                await tx.cuestionario.create({
                  data: {
                    leccion: { connect: { id: createdLeccion.id } },
                    preguntas: {
                      create: l.cuestionario.preguntas.map((p: any) => ({
                        texto: p.texto ?? '',
                        tipo: p.tipo ?? undefined,
                        respuestaCorrecta: p.respuestaCorrecta ?? null,
                        opciones: Array.isArray(p.opciones) && p.opciones.length > 0 ? { create: p.opciones.map((o: any) => ({ texto: o.texto ?? '', esCorrecta: !!o.esCorrecta })) } : undefined,
                      })),
                    },
                  },
                });
              }
            }
          } 
        } else {
          await tx.seccion.create({
            data: {
              titulo: s.titulo ?? '',
              orden: s.orden ?? 0,
              curso: { connect: { id } },
              lecciones: Array.isArray(s.lecciones) && s.lecciones.length > 0
                ? {
                    create: s.lecciones.map((l: any) => ({
                      titulo: l.titulo ?? '',
                      contenido: l.contenido ?? null,
                      orden: l.orden ?? 0,
                      videos: Array.isArray(l.videos) && l.videos.length > 0 ? { create: l.videos.map((v: any) => ({ titulo: v.titulo ?? '', url: v.url ?? '', orden: v.orden ?? 0 })) } : undefined,
                      cuestionario: l.cuestionario && Array.isArray(l.cuestionario.preguntas) && l.cuestionario.preguntas.length > 0
                        ? {
                            create: {
                              preguntas: l.cuestionario.preguntas.map((p: any) => ({
                                texto: p.texto ?? '',
                                tipo: p.tipo ?? undefined,
                                respuestaCorrecta: p.respuestaCorrecta ?? null,
                                opciones: Array.isArray(p.opciones) && p.opciones.length > 0 ? { create: p.opciones.map((o: any) => ({ texto: o.texto ?? '', esCorrecta: !!o.esCorrecta })) } : undefined,
                              })),
                            },
                          }
                        : undefined,
                    })),
                  }
                : undefined,
            },
          });
        }
      } 

      const updated = await tx.curso.findUnique({
        where: { id },
        include: {
          secciones: {
            include: {
              lecciones: {
                include: {
                  videos: true,
                  cuestionario: { include: { preguntas: { include: { opciones: true } } } },
                },
              },
            },
          },
        },
      });

      return updated;
    }); 
  } catch (err) {
    throw new InternalServerErrorException('Error actualizando curso');
  }
}


  async remove(id: number) {
    const curso = await this.prisma.curso.findUnique({
      where: { id },
      include: { secciones: { include: { lecciones: { include: { cuestionario: true } } } }, usuarios: true, pagos: true, carritoItems: true },
    });
    if (!curso) throw new NotFoundException('Curso no encontrado');

    return this.prisma.$transaction(async (tx) => {
      // por cada seccion -> recolectar lecciones -> borrar su arbol
      const seccionIds = curso.secciones.map(s => s.id);
      if (seccionIds.length) {
        const lecciones = await tx.leccion.findMany({ where: { seccionId: { in: seccionIds } }, select: { id: true } });
        const leccionIds = lecciones.map(l => l.id);
        if (leccionIds.length) {
          const cuestIds = (await tx.cuestionario.findMany({ where: { leccionId: { in: leccionIds } }, select: { id: true } })).map(c => c.id);
          if (cuestIds.length) {
            await tx.opcion.deleteMany({ where: { pregunta: { cuestionarioId: { in: cuestIds } } } });
            await tx.pregunta.deleteMany({ where: { cuestionarioId: { in: cuestIds } } });
            await tx.cuestionario.deleteMany({ where: { id: { in: cuestIds } } });
          }
          await tx.video.deleteMany({ where: { leccionId: { in: leccionIds } } });
          await tx.leccion.deleteMany({ where: { id: { in: leccionIds } } });
        }
        await tx.seccion.deleteMany({ where: { id: { in: seccionIds } } });
      }

      await tx.cursoUser.deleteMany({ where: { cursoId: id } });
      await tx.pago.deleteMany({ where: { cursoId: id } });
      await tx.carritoItem.deleteMany({ where: { cursoId: id } });

      return tx.curso.delete({ where: { id } });
    });
  }


  async findAllCursosForUI() {
    return this.prisma.curso.findMany({
      select: { id: true, titulo: true, descripcion: true, precio: true, imagenUrl: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

async findOneCursoForUI(id: number) {
  return this.prisma.curso.findUnique({
    where: { id },
    select: {
      id: true,
      titulo: true,
      descripcion: true,
      precio: true,
      imagenUrl: true,
      createdAt: true,

      secciones: {
        select: {
          id: true,
          titulo: true,
          orden: true,

          lecciones: {
            select: {
              id: true,
              titulo: true,
              orden: true,
            },
            orderBy: { orden: "asc" },
          },
        },
        orderBy: { orden: "asc" },
      },
    },
  });
}




  async addVideosToLeccion(leccionId: number, videos: { titulo: string; url: string; orden?: number }[]) {
    return this.prisma.video.createMany({
      data: (videos || []).map((v, i) => ({ titulo: v.titulo ?? '', url: v.url ?? '', leccionId, orden: v.orden ?? i + 1 })),
    });
  }


async validarAcceso(cursoId: number, userId: number) {
  const curso = await this.prisma.curso.findUnique({ where: { id: cursoId } });
  if (!curso) throw new NotFoundException("Curso no encontrado");

  const comprado = await this.prisma.cursoUser.findUnique({
    where: {
      cursoId_userId: { cursoId, userId }
    }
  });

  if (!comprado) {
    throw new ForbiddenException("Debes comprar el curso antes de acceder");
  }

  return { acceso: true };
}


async misCursos(userId: number) {
  return this.prisma.cursoUser.findMany({
    where: { userId },
    include: {
      curso: true,
    },
  });
}

async detalleCurso(id: number) {
  return this.prisma.curso.findUnique({
    where: { id },
    include: {
      secciones: {
        orderBy: { orden: 'asc' },
        include: {
          lecciones: {
            orderBy: { orden: 'asc' },
            include: {
              videos: {
                orderBy: { orden: 'asc' },
              },
              cuestionario: {
                include: {
                  preguntas: {
                    include: {
                      opciones: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}

}
