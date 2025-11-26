import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  UseGuards,
  BadRequestException,
  Query,
  Res,
  Req,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EbookService } from './ebook.service';
import { CreateEbookDto } from './dto/create-ebook.dto';
import { UpdateEbookDto } from './dto/update-ebook.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { Response, Request } from 'express';
import * as fs from 'fs';
import * as path from 'path';


interface AuthenticatedRequest extends Request {
  user?: { id: number; email?: string };
}

@Controller('ebooks')
export class EbookController {
  constructor(private readonly ebookService: EbookService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() dto: CreateEbookDto) {
    return this.ebookService.create(dto);
  }

  @Get()
  findAll(@Query('includeInactive') includeInactive?: string) {
    const showInactive = includeInactive === 'true';
    return this.ebookService.findAll(showInactive);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ebookService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEbookDto) {
    return this.ebookService.update(id, dto);
  }

  @Post(':id/upload-pdf')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadPdf(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('El archivo PDF es requerido');
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('El archivo debe ser un PDF válido');
    }

    return this.ebookService.uploadPdf(id, file);
  }

  @Post(':id/upload-portada')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadPortada(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('La portada es requerida');

    const validImages = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validImages.includes(file.mimetype)) {
      throw new BadRequestException('La portada debe ser JPG, PNG o WEBP');
    }

    return this.ebookService.uploadPortada(id, file);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/pdf')
  async descargarPdf(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    const userId = req.user?.id;
    if (!userId) throw new ForbiddenException('Debes iniciar sesión');

    const filePath = await this.ebookService.getPdf(id, userId);
    if (!fs.existsSync(filePath)) throw new NotFoundException('PDF no encontrado');

    return res.download(filePath, path.basename(filePath));
  }

  @Get(':id/portada')
  async obtenerPortada(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const filePath = await this.ebookService.getPortada(id);
    if (!fs.existsSync(filePath)) throw new NotFoundException('Portada no encontrada');

    return res.sendFile(filePath);
  }

  // Endpoint para descargar todos los ebooks comprados como ZIP
}
