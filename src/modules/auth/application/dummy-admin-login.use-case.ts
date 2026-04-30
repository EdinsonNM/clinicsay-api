import { Injectable, UnauthorizedException } from '@nestjs/common';

export interface AdminSession {
  token: string;
  user: {
    id: string;
    role: 'admin';
    name: string;
  };
}

@Injectable()
export class DummyAdminLoginUseCase {
  execute(username: string, password: string): AdminSession {
    if (username !== 'admin' || password !== 'admin') {
      throw new UnauthorizedException('Credenciales dummy invalidas');
    }

    return {
      token: 'dummy-admin-token',
      user: { id: 'admin-1', role: 'admin', name: 'Administrador ClinicSay' },
    };
  }
}
