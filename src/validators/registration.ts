export class RegistrationInputError extends Error {
  constructor(public readonly fields: Record<string, string>) {
    super('Revisa los datos del formulario.');
    this.name = 'RegistrationInputError';
  }
}

export function validateRegistration(input: unknown) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new RegistrationInputError({
      form: 'El formulario debe enviarse como un objeto JSON.',
    });
  }

  const source = input as Record<string, unknown>;

  const name = typeof source.name === 'string' ? source.name.trim() : '';

  const email =
    typeof source.email === 'string' ? source.email.trim().toLowerCase() : '';

  const message =
    typeof source.message === 'string' ? source.message.trim() : '';

  const fields: Record<string, string> = {};

  if (name.length < 2 || name.length > 100) {
    fields.name = 'Escribe un nombre de entre 2 y 100 caracteres.';
  }

  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email)) {
    fields.email = 'Escribe un correo válido de hasta 254 caracteres.';
  }

  if (message.length < 1 || message.length > 1000) {
    fields.message = 'Escribe un mensaje de entre 1 y 1000 caracteres.';
  }

  if (Object.keys(fields).length > 0) {
    throw new RegistrationInputError(fields);
  }

  return {
    name,
    email,
    message,
    sessionToken: source.sessionToken,
  };
}
