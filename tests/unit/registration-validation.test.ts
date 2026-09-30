import { describe, expect, it } from 'vitest';
import {
  RegistrationInputError,
  validateRegistration,
} from '../../src/validators/registration.js';

const validInput = {
  name: 'Víctor Aguilar',
  email: 'victor@example.com',
  message: 'Me interesa asistir.',
  sessionToken: 'token-for-validation-test',
};

describe('Validación de registro', () => {
  it('recorta espacios y normaliza el correo a minúsculas', () => {
    expect(
      validateRegistration({
        ...validInput,
        name: '  Víctor Aguilar  ',
        email: '  VICTOR@EXAMPLE.COM  ',
        message: '  Me interesa asistir.  ',
      }),
    ).toEqual(validInput);
  });

  it('rechaza entradas que no sean objetos', () => {
    for (const input of [null, undefined, [], 'texto', 123]) {
      expect(() => validateRegistration(input)).toThrow(RegistrationInputError);
    }
  });

  it('rechaza nombres fuera de los límites', () => {
    for (const name of ['', 'A', 'a'.repeat(101)]) {
      expect(() => validateRegistration({ ...validInput, name })).toThrow(
        RegistrationInputError,
      );
    }
  });

  it('rechaza correos malformados o demasiado largos', () => {
    for (const email of [
      '',
      'sin-arroba',
      'persona@',
      'persona @example.com',
      `${'a'.repeat(255)}@example.com`,
    ]) {
      expect(() => validateRegistration({ ...validInput, email })).toThrow(
        RegistrationInputError,
      );
    }
  });

  it('rechaza mensajes vacíos o demasiado largos', () => {
    for (const message of ['', '   ', 'a'.repeat(1001)]) {
      expect(() => validateRegistration({ ...validInput, message })).toThrow(
        RegistrationInputError,
      );
    }
  });

  it('acepta el límite de nombre y mensaje', () => {
    const result = validateRegistration({
      ...validInput,
      name: 'a'.repeat(100),
      message: 'a'.repeat(1000),
    });

    expect(result.name).toHaveLength(100);
    expect(result.message).toHaveLength(1000);
  });

  it('incluye los errores de cada campo para mostrarlos en el formulario', () => {
    try {
      validateRegistration({ name: '', email: '', message: '' });
      throw new Error('La validación debía rechazar el formulario.');
    } catch (error) {
      expect(error).toBeInstanceOf(RegistrationInputError);
      expect(error).toMatchObject({
        fields: {
          name: expect.any(String),
          email: expect.any(String),
          message: expect.any(String),
        },
      });
    }
  });
});
