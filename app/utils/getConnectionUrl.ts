export default function getConnectionUrl() {
  if (process.env.DATABASE_URL !== undefined) {
    return process.env.DATABASE_URL;
  }
  const { POSTGRES_HOST, POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_USER } = process.env;
  return `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;
}
