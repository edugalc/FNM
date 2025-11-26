import { IsEmail, IsOptional, MinLength, IsIn } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  name?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsIn(['USER', 'ADMIN'], {
    message: 'El rol debe ser "user" o "admin"',
  })
  role?: 'USER' | 'ADMIN';
}
