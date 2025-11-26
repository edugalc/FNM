import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEbookDto } from './dto/create-ebook.dto';
import { UpdateEbookDto } from './dto/update-ebook.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EbookService {
  private pdfPath = path.resolve('uploads/ebooks/pdf');
  private portadaPath = path.resolve('uploads/ebooks/portadas');

  constructor(private prisma: PrismaService) {}

  async create(data: CreateEbookDto) {
    return this.prisma.ebook.create({
      data: {
        ...data,
        archivo: null,
        portada: null,
      },
    });
  }

  async findAll(showInactive = false) {
    return this.prisma.ebook.findMany({
      where: showInactive ? {} : { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const ebook = await this.prisma.ebook.findUnique({ where: { id } });
    if (!ebook) throw new NotFoundException('Ebook no encontrado');
    return ebook;
  }

  async update(id: number, data: UpdateEbookDto) {
    await this.findOne(id);

    const cleanData: any = {};
    if (data.titulo !== undefined) cleanData.titulo = data.titulo;
    if (data.descripcion !== undefined) cleanData.descripcion = data.descripcion;
    if (data.autor !== undefined) cleanData.autor = data.autor;
    if (data.precio !== undefined) cleanData.precio = data.precio;
    if (data.isActive !== undefined) cleanData.isActive = data.isActive;

    return this.prisma.ebook.update({
      where: { id },
      data: cleanData,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.ebook.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async activate(id: number) {
    await this.findOne(id);
    return this.prisma.ebook.update({
      where: { id },
      data: { isActive: true },
    });
  }

  async uploadPdf(id: number, file: Express.Multer.File) {
    const ebook = await this.findOne(id);

    if (!file) throw new BadRequestException('Archivo PDF requerido');

    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('El archivo debe ser un PDF válido');
    }

    // Crear carpeta si no existe
    if (!fs.existsSync(this.pdfPath)) {
      fs.mkdirSync(this.pdfPath, { recursive: true });
    }

    const filename = `ebook_${id}_${Date.now()}.pdf`;
    const fullPath = path.join(this.pdfPath, filename);

    fs.writeFileSync(fullPath, file.buffer);

    if (ebook.archivo) {
      const oldPath = path.join(this.pdfPath, ebook.archivo);

      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (err) {
          console.error('Error al borrar PDF viejo:', err);
        }
      }
    }

    return this.prisma.ebook.update({
      where: { id },
      data: { archivo: filename },
    });
  }

  async uploadPortada(id: number, file: Express.Multer.File) {
    const ebook = await this.findOne(id);

    if (!file) throw new BadRequestException('Portada requerida');

    const validImages = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validImages.includes(file.mimetype)) {
      throw new BadRequestException('La portada debe ser JPG, PNG o WEBP');
    }

    if (!fs.existsSync(this.portadaPath)) {
      fs.mkdirSync(this.portadaPath, { recursive: true });
    }

    const ext = path.extname(file.originalname) || '.jpg';
    const filename = `portada_${id}_${Date.now()}${ext}`;
    const fullPath = path.join(this.portadaPath, filename);

    fs.writeFileSync(fullPath, file.buffer);

    // eliminar portada anterior
    if (ebook.portada) {
      const oldPath = path.join(this.portadaPath, ebook.portada);

      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (err) {
          console.error('Error al borrar portada vieja:', err);
        }
      }
    }

    return this.prisma.ebook.update({
      where: { id },
      data: { portada: filename },
    });
  }

  async getPdf(id: number, userId: number) {
    const ebook = await this.findOne(id);

    if (!ebook) throw new NotFoundException("Ebook no encontrado");

    const comprado = await this.prisma.ebookUser.findUnique({
      where: {
        ebookId_userId: { ebookId: id, userId },
      },
    });

    if (!comprado) {
      throw new ForbiddenException("No has comprado este ebook");
    }

    if (!ebook.archivo) {
      throw new NotFoundException("Este ebook no tiene archivo PDF");
    }

    const filePath = path.join(this.pdfPath, ebook.archivo);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException("Archivo PDF no encontrado en el servidor");
    }

    return filePath;
}


  async getPortada(id: number) {
    const ebook = await this.findOne(id);

    if (!ebook.portada) {
      throw new NotFoundException('Este ebook no tiene portada');
    }

    const filePath = path.join(this.portadaPath, ebook.portada);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Portada no encontrada en el servidor');
    }

    return filePath;
  }

}
