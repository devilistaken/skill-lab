const test = require('node:test');
const assert = require('node:assert/strict');
const { validateEnv } = require('../config/validateEnv');

const base = {
  NODE_ENV: 'development',
  PORT: '3000',
  MONGO_URI: 'mongodb://127.0.0.1:27017/one_off_transfer'
};

test('valid development configuration', () => {
  assert.equal(validateEnv(base).PORT, 3000);
});

test('invalid port', () => {
  assert.throws(() => validateEnv({...base, PORT:'99999'}), /PORT/);
});

test('missing MongoDB URI', () => {
  assert.throws(() => validateEnv({...base, MONGO_URI:''}), /MONGO_URI/);
});

test('invalid environment', () => {
  assert.throws(() => validateEnv({...base, NODE_ENV:'live'}), /NODE_ENV/);
});

test('weak production secret', () => {
  assert.throws(() => validateEnv({
    ...base, NODE_ENV:'production',
    JWT_SECRET:'weak',
    BASE_URL:'https://example.com',
    CORS_ORIGIN:'https://example.com'
  }), /JWT_SECRET/);
});

test('wildcard production CORS', () => {
  assert.throws(() => validateEnv({
    ...base, NODE_ENV:'production',
    JWT_SECRET:'x'.repeat(48),
    BASE_URL:'https://example.com',
    CORS_ORIGIN:'*'
  }), /CORS_ORIGIN/);
});

test('insecure production URL', () => {
  assert.throws(() => validateEnv({
    ...base, NODE_ENV:'production',
    JWT_SECRET:'x'.repeat(48),
    BASE_URL:'http://example.com',
    CORS_ORIGIN:'https://example.com'
  }), /HTTPS/);
});

test('valid production configuration', () => {
  const result = validateEnv({
    ...base, NODE_ENV:'production',
    JWT_SECRET:'x'.repeat(48),
    BASE_URL:'https://example.com',
    CORS_ORIGIN:'https://example.com'
  });
  assert.equal(result.NODE_ENV, 'production');
});
