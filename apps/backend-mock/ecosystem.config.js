module.exports = {
  apps: [
    {
      name: 'backend-mock',
      script: '.output/server/index.mjs',
      interpreter: 'node',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 5320,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '256M',
      out_file: 'logs/combined.log',
      error_file: 'logs/error.log',
      time: true,
    },
  ],
}
