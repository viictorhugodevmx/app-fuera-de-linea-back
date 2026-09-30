import 'dotenv/config';

export function getSessionConfig() {
  const secret = process.env.SESSION_SECRET;

  if (!secret || secret.length < 32 || secret.startsWith('REPLACE_')) {
    throw new Error(
      'SESSION_SECRET debe contener un secreto propio de al menos 32 caracteres.',
    );
  }

  return {
    secret,
    ttlSeconds: 300,
  };
}
