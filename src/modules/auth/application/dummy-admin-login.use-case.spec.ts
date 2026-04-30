import { DummyAdminLoginUseCase } from './dummy-admin-login.use-case';

describe('DummyAdminLoginUseCase', () => {
  it('authenticates admin dummy', () => {
    expect(new DummyAdminLoginUseCase().execute('admin', 'admin').token).toBe(
      'dummy-admin-token',
    );
  });
});
