import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // 🔹 Crear usuario (registro)
  async createUser(data: CreateUserDto) {
    // Verificar si ya existe el correo
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new Error('El correo ya está registrado');
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
  }

  // 🔹 Obtener todos los usuarios
  async findAllUsers() {
    return this.prisma.user.findMany({
      select: { id: true, name: true, email: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 🔹 Obtener un usuario por ID
  async findUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, createdAt: true },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  // 🔹 Actualizar usuario
  async updateUser(id: number, data: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    return this.prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
      },
      select: { id: true, name: true, email: true },
    });
  }

  // 🔹 Eliminar usuario
  async deleteUser(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return this.prisma.user.delete({ where: { id } });
  }
}
