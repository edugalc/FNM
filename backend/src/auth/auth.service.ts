import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Registro
  async register(data: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new UnauthorizedException('El correo ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: { ...data, password: hashedPassword },
      select: { id: true, name: true, email: true },
    });

    return {
      user,
      token: this.generateToken(user.id),
    };
  }

  // Login
  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Credenciales incorrectas');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Credenciales incorrectas');

    return {
      user: { id: user.id, name: user.name, email: user.email },
      token: this.generateToken(user.id),
    };
  }

  // Generar JWT
  private generateToken(userId: number) {
    return this.jwtService.sign({ sub: userId });
  }
}
