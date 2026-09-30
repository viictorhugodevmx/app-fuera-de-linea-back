import type { Pool } from 'mysql2/promise';
import { validateRegistration } from '../validators/registration.js';
import { createSessionService } from './registration-session.js';

interface RegistrationOptions {
  secret: string;
  ttlSeconds: number;
}

export class EmailAlreadyRegisteredError extends Error {
  constructor() {
    super('Este correo ya está registrado en el evento.');
    this.name = 'EmailAlreadyRegisteredError';
  }
}

export function createRegistrationService(
  pool: Pool,
  sessionOptions: RegistrationOptions,
) {
  async function register(input: unknown, receivedAt: number) {
    const registration = validateRegistration(input);

    const sessionService = createSessionService(
      sessionOptions,
      () => receivedAt,
    );

    sessionService.verify(registration.sessionToken);

    try {
      await pool.execute(
        'INSERT INTO registrations (name, email, message) VALUES (?, ?, ?)',
        [registration.name, registration.email, registration.message],
      );
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'ER_DUP_ENTRY'
      ) {
        throw new EmailAlreadyRegisteredError();
      }

      throw error;
    }

    return {
      message: 'Tu registro fue confirmado.',
    };
  }

  return { register };
}
