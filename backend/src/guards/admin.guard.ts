import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    if (!req.user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Solo los administradores pueden acceder a esta ruta');
    }

    return true;
  }
}
