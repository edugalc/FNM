import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    return this.userService.findAllUsers();
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.createUser(createUserDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al crear usuario',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.findUserById(Number(id));
    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      return await this.userService.updateUser(Number(id), updateUserDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al actualizar usuario',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    try {
      return await this.userService.deleteUser(Number(id));
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al eliminar usuario',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
