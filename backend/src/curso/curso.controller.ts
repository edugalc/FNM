import { 
  Controller, Get, Post, Patch, Delete, Param, Body, UploadedFile,
  UseInterceptors, BadRequestException, NotFoundException, UseGuards, Req, ForbiddenException
} from '@nestjs/common';
import { CursoService } from './curso.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('curso')
export class CursoController {
  constructor(private readonly cursoService: CursoService) {}


  
  @UseGuards(JwtAuthGuard)
  @Get('mis-cursos')
  async misCursos(@Req() req) {
    return this.cursoService.misCursos(req.user.id);
  }


 @UseGuards(JwtAuthGuard)
  @Get(':id/detalle')
  async detalleCurso(@Param('id') id: string, @Req() req) {
    const cursoId = Number(id);
    if (isNaN(cursoId)) throw new BadRequestException("ID inválido");

    const curso = await this.cursoService.detalleCurso(cursoId);
    if (!curso) throw new NotFoundException("Curso no encontrado");

    const acceso = await this.cursoService.validarAcceso(cursoId, req.user.id);

    if (!acceso) {
      throw new ForbiddenException("No tienes acceso a este curso");
    }

    return curso;
  }

  @Get('ui')
  async findAllForUI() {
    return this.cursoService.findAllCursosForUI();
  }

  @Get('ui/:id')
  async findOneForUI(@Param('id') id: string) {
    const cursoId = Number(id);
    if (isNaN(cursoId)) throw new BadRequestException('ID inválido');

    const curso = await this.cursoService.findOneCursoForUI(cursoId);
    if (!curso) throw new NotFoundException('Curso no encontrado');

    return curso;
  }


  @Get()
  findAll() {
    return this.cursoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const cursoId = Number(id);
    if (isNaN(cursoId)) throw new BadRequestException('ID inválido');
    return this.cursoService.findOne(cursoId);
  }


  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `curso-${unique}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() imagen: Express.Multer.File | undefined,
    @Body() body: any,
  ) {
    const secciones = typeof body.secciones === 'string'
      ? JSON.parse(body.secciones)
      : body.secciones || [];

    const data: CreateCursoDto = {
      titulo: body.titulo ?? '',
      descripcion: body.descripcion ?? '',
      precio: Number(body.precio ?? 0),
      secciones,
      imagenUrl: imagen
        ? `/uploads/images/${imagen.filename}`
        : body.imagenUrl ?? null,
    };

    return this.cursoService.create(data);
  }


 @UseGuards(JwtAuthGuard)
@Patch(':id')
@UseInterceptors(
  FileInterceptor('imagen', {
    storage: diskStorage({
      destination: './uploads/images',
      filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `curso-${unique}${extname(file.originalname)}`);
      },
    }),
  }),
)
async update(
  @Param('id') id: string,
  @UploadedFile() imagen: Express.Multer.File | undefined,
  @Body() body: any,
) {
  try {
    const cursoId = Number(id);
    if (isNaN(cursoId)) throw new BadRequestException('ID inválido');

    const updateData: UpdateCursoDto = {};

    if (body.titulo !== undefined) updateData.titulo = String(body.titulo);
    if (body.descripcion !== undefined)
      updateData.descripcion = String(body.descripcion);
    if (body.precio !== undefined)
      updateData.precio = Number(body.precio);

    if (body.secciones !== undefined) {
      updateData.secciones =
        typeof body.secciones === 'string'
          ? JSON.parse(body.secciones)
          : body.secciones;
    }

    if (imagen) {
      updateData.imagenUrl = `/uploads/images/${imagen.filename}`;
    } else if (body.imagenUrl !== undefined) {
      updateData.imagenUrl = body.imagenUrl;
    }

    return await this.cursoService.update(cursoId, updateData);
  } catch (error) {
    console.error('ERROR UPDATE CURSO:', error);
    throw new BadRequestException(error.message || 'Error interno al actualizar el curso');
  }
}

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    const cursoId = Number(id);
    if (isNaN(cursoId)) throw new BadRequestException('ID inválido');
    return this.cursoService.remove(cursoId);
  }

    @Get(':id/acceso')
  async validarAcceso(@Param('id') id: string, @Req() req) {
    const cursoId = Number(id);
    const userId = req.user.id; 

    return this.cursoService.validarAcceso(cursoId, userId);
  };
}
