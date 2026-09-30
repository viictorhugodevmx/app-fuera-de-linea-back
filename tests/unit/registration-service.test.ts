import type { ResultSetHeader } from 'mysql2/promise';
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';
import { createDatabasePool } from '../../src/db/pool.js';
import { createRegistrationService } from '../../src/services/registration.js';
import { createSessionService } from '../../src/services/registration-session.js';

const start = Date.parse('2026-09-30T03:00:00.000Z');
const options = {
  secret: 'a'.repeat(64),
  ttlSeconds: 300,
};

const pool = createDatabasePool('test');
const service = createRegistrationService(pool, options);

function validInput() {
  const issuer = createSessionService(options, () => start);

  return {
    name: 'Prueba de tiempo',
    email: 'timing@example.com',
    message: 'Comprobación del plazo.',
    sessionToken: issuer.issue().sessionToken,
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

afterAll(async () => {
  await pool.end();
});

describe('Servicio de registro', () => {
  it('acepta una solicitud recibida a tiempo aunque se procese después del plazo', async () => {
    const execute = vi
      .spyOn(pool, 'execute')
      .mockResolvedValue([{ affectedRows: 1 } as ResultSetHeader, []]);

    vi.spyOn(Date, 'now').mockReturnValue(start + 300_001);

    await expect(
      service.register(validInput(), start + 299_999),
    ).resolves.toEqual({
      message: 'Tu registro fue confirmado.',
    });

    expect(Date.now()).toBeGreaterThan(start + 300_000);
    expect(execute).toHaveBeenCalledTimes(1);
  });

  it('propaga el fallo de conexión sin confirmar ni reintentar la inserción', async () => {
    const execute = vi.spyOn(pool, 'execute').mockRejectedValue(
      Object.assign(new Error('Fallo controlado de conexión'), {
        code: 'ECONNREFUSED',
      }),
    );

    await expect(
      service.register(validInput(), start + 1),
    ).rejects.toMatchObject({
      code: 'ECONNREFUSED',
    });

    expect(execute).toHaveBeenCalledTimes(1);
  });
});
