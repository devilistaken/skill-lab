function validateEnv(env = process.env) {
  const errors = [];
  const nodeEnv = env.NODE_ENV || 'development';
  const port = env.PORT ?? '3000';
  const portNumber = Number(port);

  if (!['development', 'test', 'production'].includes(nodeEnv))
    errors.push('Invalid NODE_ENV');

  if (!/^\d+$/.test(String(port)) || !Number.isInteger(portNumber) || portNumber < 1 || portNumber > 65535)
    errors.push('Invalid PORT');

  if (!/^mongodb(\+srv)?:\/\/.+/.test(env.MONGO_URI || ''))
    errors.push('Invalid MONGO_URI');

  if (nodeEnv === 'production') {
    const secret = env.JWT_SECRET || '';

    if (secret.length < 32 ||
        ['dev-only-secret-change-me', 'change-this-to-a-long-random-string'].includes(secret))
      errors.push('Insecure JWT_SECRET');

    for (const key of ['BASE_URL', 'FRONTEND_URL']) {
      if (key === 'FRONTEND_URL' && !env[key]) continue;
      try {
        if (new URL(env[key]).protocol !== 'https:') throw new Error();
      } catch {
        errors.push(key + ' must use HTTPS');
      }
    }

    if (!env.CORS_ORIGIN || env.CORS_ORIGIN === '*')
      errors.push('Invalid CORS_ORIGIN');
  }

  if (errors.length)
    throw new Error('Configuration validation failed:\n' + errors.join('\n'));

  return {
    NODE_ENV: nodeEnv,
    PORT: portNumber,
    MONGO_URI: env.MONGO_URI,
    BASE_URL: env.BASE_URL || 'http://localhost:3000',
    FRONTEND_URL: env.FRONTEND_URL || env.BASE_URL || 'http://localhost:3000',
    CORS_ORIGIN: env.CORS_ORIGIN || '*'
  };
}

module.exports = { validateEnv };
