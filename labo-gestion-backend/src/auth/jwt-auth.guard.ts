import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    // Si une erreur survient ou si l'utilisateur n'est pas trouvé (token invalide/absent)
    if (err || !user) {
      throw err || new UnauthorizedException("Accès refusé : Jeton invalide ou absent.");
    }
    return user;
  }
}
