import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      const { authorization } = request.headers;

      if (!authorization || authorization.trim() === '') {
        throw new Error('Unauthorized');
        0;
      }

      const token = authorization.split('Bearer ')[1];
      const resp = await this.authService.validateToken(token);

      request.decodedData = resp;
      return resp != null;
    } catch (error) {
      console.log('auth error - ', error.message);
      throw new ForbiddenException(
        error.message || 'session expired! Please sign In',
      );
    }
  }
}
