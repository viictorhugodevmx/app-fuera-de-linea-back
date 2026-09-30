import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';

interface SessionPayload {
  version: 1;
  id: string;
  issuedAt: number;
  expiresAt: number;
}

interface SessionOptions {
  secret: string;
  ttlSeconds: number;
}

export class SessionError extends Error {
  constructor(public readonly code: 'INVALID_SESSION' | 'SESSION_EXPIRED') {
    super(
      code === 'SESSION_EXPIRED'
        ? 'El plazo de registro terminó.'
        : 'La sesión de registro no es válida.',
    );

    this.name = 'SessionError';
  }
}

function isSessionPayload(value: unknown): value is SessionPayload {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const payload = value as Partial<SessionPayload>;

  return (
    payload.version === 1 &&
    typeof payload.id === 'string' &&
    payload.id.length === 36 &&
    Number.isSafeInteger(payload.issuedAt) &&
    Number.isSafeInteger(payload.expiresAt)
  );
}

export function createSessionService(
  options: SessionOptions,
  now: () => number = Date.now,
) {
  if (
    options.secret.length < 32 ||
    !Number.isSafeInteger(options.ttlSeconds) ||
    options.ttlSeconds < 1
  ) {
    throw new Error('Configuración de sesiones inválida.');
  }

  const lifetime = options.ttlSeconds * 1000;

  function sign(encodedPayload: string): string {
    return createHmac('sha256', options.secret)
      .update(encodedPayload)
      .digest('base64url');
  }

  function issue() {
    const issuedAt = now();

    const payload: SessionPayload = {
      version: 1,
      id: randomUUID(),
      issuedAt,
      expiresAt: issuedAt + lifetime,
    };

    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
      'base64url',
    );

    return {
      sessionToken: `${encodedPayload}.${sign(encodedPayload)}`,
      expiresAt: new Date(payload.expiresAt).toISOString(),
      serverTime: new Date(issuedAt).toISOString(),
    };
  }

  function verify(token: unknown): SessionPayload {
    if (typeof token !== 'string' || token.length > 1024) {
      throw new SessionError('INVALID_SESSION');
    }

    const parts = token.split('.');

    if (
      parts.length !== 2 ||
      !/^[A-Za-z0-9_-]+$/.test(parts[0] ?? '') ||
      !/^[A-Za-z0-9_-]{43}$/.test(parts[1] ?? '')
    ) {
      throw new SessionError('INVALID_SESSION');
    }

    const [encodedPayload, signature] = parts;
    const expected = Buffer.from(sign(encodedPayload));
    const received = Buffer.from(signature);

    if (
      expected.length !== received.length ||
      !timingSafeEqual(expected, received)
    ) {
      throw new SessionError('INVALID_SESSION');
    }

    let payload: unknown;

    try {
      payload = JSON.parse(
        Buffer.from(encodedPayload, 'base64url').toString('utf8'),
      );
    } catch {
      throw new SessionError('INVALID_SESSION');
    }

    const currentTime = now();

    if (
      !isSessionPayload(payload) ||
      payload.issuedAt < 0 ||
      payload.issuedAt > currentTime ||
      payload.expiresAt - payload.issuedAt !== lifetime
    ) {
      throw new SessionError('INVALID_SESSION');
    }

    if (currentTime >= payload.expiresAt) {
      throw new SessionError('SESSION_EXPIRED');
    }

    return payload;
  }

  return { issue, verify };
}
