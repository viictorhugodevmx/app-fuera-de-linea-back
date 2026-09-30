import 'dotenv/config';

export function getAllowedOrigins(): string[] {
  const origins = (process.env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (origins.length === 0) {
    throw new Error('ALLOWED_ORIGINS debe contener al menos un origen.');
  }

  for (const origin of origins) {
    let parsed: URL;

    try {
      parsed = new URL(origin);
    } catch {
      throw new Error(`Origen inválido en ALLOWED_ORIGINS: ${origin}`);
    }

    if (
      !['http:', 'https:'].includes(parsed.protocol) ||
      parsed.origin !== origin
    ) {
      throw new Error(`Origen inválido en ALLOWED_ORIGINS: ${origin}`);
    }
  }

  return [...new Set(origins)];
}
