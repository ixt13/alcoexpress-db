import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractToken(request);

    if (!token) throw new UnauthorizedException();

    try {
      const payload = this.jwtService.verify(token);
      request.user = payload;

      return true;
    } catch (error) {}
    throw new UnauthorizedException();
  }

  private extractToken({
    headers,
  }: {
    headers: { authorization?: string };
  }): string | null {
    const [type, token] = headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : null;
  }
}
