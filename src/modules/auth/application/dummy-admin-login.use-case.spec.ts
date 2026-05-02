import { UnauthorizedException } from '@nestjs/common';
import { DummyAdminLoginUseCase } from './dummy-admin-login.use-case';

describe('DummyAdminLoginUseCase', () => {
  it('authenticates admin dummy', () => {
    expect(new DummyAdminLoginUseCase().execute('admin', 'admin').token).toBe(
      'dummy-admin-token',
    );
  });

  it('rechaza credenciales distintas del dummy', () => {
    expect(() =>
      new DummyAdminLoginUseCase().execute('admin', 'incorrecta'),
    ).toThrow(UnauthorizedException);
  });
});
