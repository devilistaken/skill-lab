
const VALID_NODE_ENVS = ['development', 'test', 'production'];

function validateEnv(env = process.env) {
  const errors = [];

  const nodeEnv = env.NODE_ENV || 'development';

  if (!VALID_NODE_ENVS.includes(nodeEnv)) {
    errors.push('NODE_ENV must be development, test, or production');
  }

  const port = env.PORT || '3000';
  const portNumber = Number(port);

  if (
    !/^\d+$/.test(String(port)) ||
    !Number.isInteger(portNumber) ||
    portNumber < 1 ||
    portNumber > 65535
  ) {
    errors.push('PORT must be an integer between 1 and 65535');
  }

  if (!env.MONGO_URI || !/^mongodb(\+srv)?:\/\//.test(env.MONGO_URI)) {
    errors.push('MONGO_URI must be a MongoDB connection URI');
  }

  if (nodeEnv === 'production') {
    if (
      !env.JWT_SECRET ||
      env.JWT_SECRET.length < 32 ||
      env.JWT_SECRET === 'dev-only-secret-change-me'
    ) {
      errors.push('Production JWT_SECRET must be at least 32 characters and not a default secret');
    }

    if (!env.BASE_URL || !env.BASE_URL.startsWith('https://')) {
      errors.push('Production BASE_URL must use HTTPS');
    }

    if (!env.CORS_ORIGIN || env.CORS_ORIGIN === '*') {
      errors.push('Production CORS_ORIGIN must specify an allowed origin');
    }
  }

  if (errors.length > 0) {
    throw new Error(
      'Invalid environment configuration:\n' +
      errors.map(error => `- ${error}`).join('\n')
    );
  }

  return {
    NODE_ENV: nodeEnv,
    PORT: portNumber,
    MONGO_URI: env.MONGO_URI,
    BASE_URL: env.BASE_URL || 'http://localhost:3000',
    CORS_ORIGIN: env.CORS_ORIGIN || '*'
  };
}

module.exports = { validateEnv };
