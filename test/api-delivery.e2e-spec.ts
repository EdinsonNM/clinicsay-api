import { existsSync } from 'fs';
import { join } from 'path';

describe('API delivery package', () => {
  const apiRoot = join(__dirname, '..');

  it('contains local Prisma artifacts for repository independence', () => {
    expect(existsSync(join(apiRoot, 'prisma', 'schema.prisma'))).toBe(true);
    expect(existsSync(join(apiRoot, 'prisma', 'migrations'))).toBe(true);
    expect(existsSync(join(apiRoot, 'prisma', 'seed.ts'))).toBe(true);
  });

  it('documents isolated Docker Compose and environment defaults', () => {
    expect(existsSync(join(apiRoot, 'docker-compose.yml'))).toBe(true);
    expect(existsSync(join(apiRoot, '.env.example'))).toBe(true);
  });
});
