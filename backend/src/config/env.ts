const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const YGOPRODECK_API_URL =
  process.env.YGOPRODECK_API_URL ??
  "https://db.ygoprodeck.com/api/v7";

const PORT = Number(process.env.PORT ?? 3000);

if (!SUPABASE_URL) {
  throw new Error(
    "La variable de entorno SUPABASE_URL no está definida."
  );
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "La variable de entorno SUPABASE_SERVICE_ROLE_KEY no está definida."
  );
}

export const env = {
  PORT,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  YGOPRODECK_API_URL,
};