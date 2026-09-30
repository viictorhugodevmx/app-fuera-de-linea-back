#!/usr/bin/env bash
set -euo pipefail

task_api_url="${API_URL:-http://localhost:3001}"
task_api_url="${task_api_url%/}"
task_temp_dir="$(mktemp -d)"

trap 'rm -rf "$task_temp_dir"' EXIT

task_status="$(curl --silent --show-error \
  -X POST "$task_api_url/api/registration-sessions" \
  -o "$task_temp_dir/session.json" \
  -w '%{http_code}')"

if [ "$task_status" != "201" ]; then
  printf 'ERROR: sesión respondió HTTP %s; se esperaba 201.\n' "$task_status"
  cat "$task_temp_dir/session.json"
  exit 1
fi

node --input-type=module - \
  "$task_temp_dir/session.json" \
  "$task_temp_dir/registration.json" <<'NODE'
import { randomUUID } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const session = JSON.parse(readFileSync(process.argv[2], 'utf8'));

if (typeof session.data?.sessionToken !== 'string') {
  throw new Error('La API no devolvió un token de sesión.');
}

writeFileSync(
  process.argv[3],
  JSON.stringify({
    name: 'Prueba manual de registro',
    email: `smoke-${randomUUID()}@example.com`,
    message: 'Comprobación del recorrido mediante curl.',
    sessionToken: session.data.sessionToken,
  }),
);
NODE

task_status="$(curl --silent --show-error \
  -X POST "$task_api_url/api/registrations" \
  -H 'Content-Type: application/json' \
  --data-binary "@$task_temp_dir/registration.json" \
  -o "$task_temp_dir/response.json" \
  -w '%{http_code}')"

if [ "$task_status" != "201" ]; then
  printf 'ERROR: registro respondió HTTP %s; se esperaba 201.\n' "$task_status"
  cat "$task_temp_dir/response.json"
  exit 1
fi

printf 'Registro: HTTP 201\n'
cat "$task_temp_dir/response.json"
printf '\n'

task_status="$(curl --silent --show-error \
  -X POST "$task_api_url/api/registrations" \
  -H 'Content-Type: application/json' \
  --data-binary "@$task_temp_dir/registration.json" \
  -o "$task_temp_dir/duplicate.json" \
  -w '%{http_code}')"

if [ "$task_status" != "409" ]; then
  printf 'ERROR: duplicado respondió HTTP %s; se esperaba 409.\n' "$task_status"
  cat "$task_temp_dir/duplicate.json"
  exit 1
fi

node --input-type=module - "$task_temp_dir/duplicate.json" <<'NODE'
import { readFileSync } from 'node:fs';

const response = JSON.parse(readFileSync(process.argv[2], 'utf8'));

if (response.error?.code !== 'EMAIL_ALREADY_REGISTERED') {
  throw new Error('La respuesta de duplicado no coincide con el contrato.');
}
NODE

printf 'Duplicado: HTTP 409 — EMAIL_ALREADY_REGISTERED\n'
