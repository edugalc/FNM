import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CursoService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCursoDto) {
    return this.prisma.curso.create({
      data: {
        titulo: data.titulo,
        descripcion: data.descripcion,
        precio: data.precio,
        secciones: data.secciones
          ? {
              create: data.secciones.map((seccion) => ({
                titulo: seccion.titulo,
                orden: seccion.orden,
                lecciones: seccion.lecciones
                  ? {
                      create: seccion.lecciones.map((leccion) => ({
                        titulo: leccion.titulo,
                        contenido: leccion.contenido,
                        orden: leccion.orden,
                        videos: leccion.videos
                          ? {
                              create: leccion.videos.map((video) => ({
                                titulo: video.titulo,
                                url: video.url,
                                orden: video.orden,
                              })),
                            }
                          : undefined,
                        cuestionario: leccion.cuestionario
                          ? {
                              create: {
                                preguntas: {
                                  create: leccion.cuestionario.preguntas.map(
                                    (pregunta) => ({
                                      texto: pregunta.texto,
                                      tipo: pregunta.tipo,
                                      respuestaCorrecta:
                                        pregunta.respuestaCorrecta,
                                      opciones: pregunta.opciones
                                        ? {
                                            create: pregunta.opciones.map(
                                              (opcion) => ({
                                                texto: opcion.texto,
                                                esCorrecta: opcion.esCorrecta,
                                              }),
                                            ),
                                          }
                                        : undefined,
                                    }),
                                  ),
                                },
                              },
                            }
                          : undefined,
                      })),
                    }
                  : undefined,
              })),
            }
          : undefined,
      },
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
    return this.prisma.curso.findUnique({
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
  }

  async update(id: number, data: UpdateCursoDto) {
    return this.prisma.curso.update({
      where: { id },
      data: {
        titulo: data.titulo,
        descripcion: data.descripcion,
        precio: data.precio,
      } as Prisma.CursoUpdateInput,
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

  async remove(id: number) {
    const curso = await this.prisma.curso.findUnique({
      where: { id },
      include: {
        secciones: {
          include: {
            lecciones: {
              include: { cuestionario: { include: { preguntas: { include: { opciones: true } } } }, videos: true },
            },
          },
        },
        usuarios: true,
        pagos: true,
        carritoItems: true,
      },
    });

    if (!curso) {
      throw new Error('Curso no encontrado');
    }
    for (const seccion of curso.secciones) {
      for (const leccion of seccion.lecciones) {
        if (leccion.cuestionario) {
          await this.prisma.opcion.deleteMany({
            where: { pregunta: { cuestionarioId: leccion.cuestionario.id } },
          });
          await this.prisma.pregunta.deleteMany({
            where: { cuestionarioId: leccion.cuestionario.id },
          });
          await this.prisma.cuestionario.delete({
            where: { id: leccion.cuestionario.id },
          });
        }

        await this.prisma.video.deleteMany({ where: { leccionId: leccion.id } });
      }
      await this.prisma.leccion.deleteMany({ where: { seccionId: seccion.id } });
    }

    await this.prisma.seccion.deleteMany({ where: { cursoId: id } });

    await this.prisma.cursoUser.deleteMany({ where: { cursoId: id } });

    await this.prisma.pago.deleteMany({ where: { cursoId: id } });

    await this.prisma.carritoItem.deleteMany({ where: { cursoId: id } });

    return this.prisma.curso.delete({ where: { id } });
}
  async findAllCursosForUI() {
    return this.prisma.curso.findMany({
      select: {
        id: true,
        titulo: true,
        descripcion: true,
        precio: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }, // últimos cursos primero
    });
  }
}
