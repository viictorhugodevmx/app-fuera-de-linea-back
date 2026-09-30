import { describe, expect, it } from 'vitest';
import {
  createSessionService,
  SessionError,
} from '../../src/services/registration-session.js';

const secret = 'a'.repeat(64);
const start = Date.parse('2026-09-30T03:00:00.000Z');

describe('Sesiones de registro', () => {
  it('emite una sesión válida con duración de cinco minutos', () => {
    const service = createSessionService(
      { secret, ttlSeconds: 300 },
      () => start,
    );

    const session = service.issue();
    const payload = service.verify(session.sessionToken);

    expect(session.serverTime).toBe('2026-09-30T03:00:00.000Z');
    expect(session.expiresAt).toBe('2026-09-30T03:05:00.000Z');
    expect(payload.id).toHaveLength(36);
    expect(payload.version).toBe(1);
  });

  it('genera identificadores distintos para sesiones nuevas', () => {
    const service = createSessionService(
      { secret, ttlSeconds: 300 },
      () => start,
    );

    const first = service.verify(service.issue().sessionToken);
    const second = service.verify(service.issue().sessionToken);

    expect(first.id).not.toBe(second.id);
  });

  it('acepta la sesión un milisegundo antes del vencimiento', () => {
    let currentTime = start;

    const service = createSessionService(
      { secret, ttlSeconds: 300 },
      () => currentTime,
    );

    const session = service.issue();
    currentTime = start + 299_999;

    expect(() => service.verify(session.sessionToken)).not.toThrow();
  });

  it('rechaza la sesión exactamente al vencer', () => {
    let currentTime = start;

    const service = createSessionService(
      { secret, ttlSeconds: 300 },
      () => currentTime,
    );

    const session = service.issue();
    currentTime = start + 300_000;

    expect(() => service.verify(session.sessionToken)).toThrow(
      'El plazo de registro terminó.',
    );
  });

  it('rechaza un contenido alterado conservando la firma original', () => {
    const service = createSessionService(
      { secret, ttlSeconds: 300 },
      () => start,
    );

    const session = service.issue();
    const [encodedPayload, signature] = session.sessionToken.split('.');

    const payload = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf8'),
    );

    payload.expiresAt += 300_000;

    const alteredPayload = Buffer.from(JSON.stringify(payload)).toString(
      'base64url',
    );

    expect(() => service.verify(`${alteredPayload}.${signature}`)).toThrow(
      'La sesión de registro no es válida.',
    );
  });

  it('rechaza una firma alterada', () => {
    const service = createSessionService(
      { secret, ttlSeconds: 300 },
      () => start,
    );

    const [payload, signature] = service.issue().sessionToken.split('.');
    const replacement = signature.startsWith('A') ? 'B' : 'A';
    const alteredSignature = replacement + signature.slice(1);

    expect(() => service.verify(`${payload}.${alteredSignature}`)).toThrow(
      SessionError,
    );
  });

  it('rechaza un token firmado con otro secreto', () => {
    const issuer = createSessionService(
      { secret, ttlSeconds: 300 },
      () => start,
    );

    const verifier = createSessionService(
      { secret: 'b'.repeat(64), ttlSeconds: 300 },
      () => start,
    );

    expect(() => verifier.verify(issuer.issue().sessionToken)).toThrow(
      'La sesión de registro no es válida.',
    );
  });

  it('rechaza entradas ausentes o malformadas', () => {
    const service = createSessionService(
      { secret, ttlSeconds: 300 },
      () => start,
    );

    for (const token of [undefined, null, 123, '', 'token', 'a.b.c']) {
      expect(() => service.verify(token)).toThrow(SessionError);
    }
  });
});
