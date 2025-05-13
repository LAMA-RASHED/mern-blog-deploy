/**
 * Environment Variable Loader
 * Loads environment variables from .env file or app-env file
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

/**
 * Load environment variables from various sources
 * Priority: .env file > app-env file > default values
 */
const loadEnv = () => {
  try {
    // Try to load from .env file
    const envPath = path.resolve(process.cwd(), '.env');
    const appEnvPath = path.resolve(process.cwd(), 'app-env');

    // Check if .env exists, otherwise try app-env
    if (fs.existsSync(envPath)) {
      console.log('Loading environment variables from .env file');
      dotenv.config({ path: envPath });
    } else if (fs.existsSync(appEnvPath)) {
      console.log('Loading environment variables from app-env file');
      // Parse app-env file manually
      const envConfig = dotenv.parse(fs.readFileSync(appEnvPath));

      // Set each variable in process.env
      Object.entries(envConfig).forEach(([key, value]) => {
        process.env[key] = value;
      });
    } else {
      console.log('No .env or app-env file found, using default values');
    }

    // Add AWS configuration defaults if not set
    if (!process.env.AWS_REGION) {
      process.env.AWS_REGION = 'us-east-1';
    }

    if (!process.env.S3_BUCKET && process.env.NODE_ENV === 'production') {
      console.warn('Warning: S3_BUCKET environment variable not set');
    }

    // Log loaded configuration (excluding sensitive data)
    console.log('Environment configuration loaded:');
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    console.log('- PORT:', process.env.PORT);
    console.log('- HOST:', process.env.HOST);
    console.log('- AWS_REGION:', process.env.AWS_REGION);
    console.log('- S3_BUCKET:', process.env.S3_BUCKET || 'Not configured');
  } catch (error) {
    console.error('Error loading environment variables:', error.message);
    // Continue with default values
  }
};

module.exports = loadEnv;
