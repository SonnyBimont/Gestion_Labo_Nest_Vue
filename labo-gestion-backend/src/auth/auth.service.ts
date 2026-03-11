import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

async validateUser(username: string, pass: string): Promise<any> {
  const user = await this.usersService.findOneByUsername(username);
  
  // Ajoutez ce log temporaire pour debugger
  console.log('Utilisateur trouvé :', user?.username, 'Hash présent :', !!user?.password);

  if (user && user.password && await bcrypt.compare(pass, user.password)) {
    const { password, ...result } = user.get();
    return result;
  }
  return null;
}

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      role: user.role,
    };
  }
}
