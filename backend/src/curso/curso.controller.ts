import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CursoService } from './curso.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

@Controller('curso')
export class CursoController {
  constructor(private readonly cursoService: CursoService) {}

  @Post()
  create(@Body() createCursoDto: CreateCursoDto) {
    return this.cursoService.create(createCursoDto);
  }

  @Get('ui')
  async findAllForUI() {
    return this.cursoService.findAllCursosForUI();
  }

  @Get()
  findAll() {
    return this.cursoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cursoService.findOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCursoDto: UpdateCursoDto) {
    return this.cursoService.update(Number(id), updateCursoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cursoService.remove(Number(id));
  }
}
