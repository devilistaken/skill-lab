
const test = require('node:test');
const assert = require('node:assert/strict');

const { validateEnv } = require('../config/validateEnv');

const validEnv = {
  NODE_ENV: 'development',
  PORT: '3000',
  MONGO_URI: 'mongodb://127.0.0.1:27017/one_off_transfer'
};

test('accepts valid development configuration', () => {
  const result = validateEnv(validEnv);
  assert.equal(result.PORT, 3000);
});

test('rejects invalid port', () => {
  assert.throws(
    () => validateEnv({ ...validEnv, PORT: '99999' }),
    /PORT must be/
  );
});

test('rejects missing MongoDB URI', () => {
  assert.throws(
    () => validateEnv({ ...validEnv, MONGO_URI: '' }),
    /MONGO_URI must be/
  );
});

test('rejects insecure production secrets', () => {
  assert.throws(
    () => validateEnv({
      ...validEnv,
      NODE_ENV: 'production',
      JWT_SECRET: 'weak',
      BASE_URL: 'https://example.com',
      CORS_ORIGIN: 'https://example.com'
    }),
    /JWT_SECRET/
  );
});

test('accepts valid production configuration', () => {
  const result = validateEnv({
    ...validEnv,
    NODE_ENV: 'production',
    JWT_SECRET: 'a'.repeat(48),
    BASE_URL: 'https://files.example.com',
    CORS_ORIGIN: 'https://files.example.com'
  });

  assert.equal(result.NODE_ENV, 'production');
});
