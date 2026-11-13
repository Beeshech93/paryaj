#!/usr/bin/env bash
set -e

# ==============================================================================
# NEW BRAND — Supabase Cloud Database Migration & Seed Pipeline
# ==============================================================================
# Usage:
#   ./scripts/deploy-supabase.sh "YOUR_SUPABASE_PASSWORD"
# Or:
#   DATABASE_URL="postgresql://..." ./scripts/deploy-supabase.sh
# ==============================================================================

echo "===================================================================="
echo "🚀 NEW BRAND — Migración de Base de Datos a Supabase Cloud"
echo "===================================================================="

PROJECT_REF="zghqluchsptyvuyhbyjm"
SUPABASE_HOST="aws-0-us-east-1.pooler.supabase.com"
SUPABASE_PORT="6543"
SUPABASE_USER="postgres.${PROJECT_REF}"

if [ -n "$1" ]; then
  DB_PASSWORD="$1"
  TARGET_DATABASE_URL="postgresql://${SUPABASE_USER}:${DB_PASSWORD}@${SUPABASE_HOST}:${SUPABASE_PORT}/postgres?sslmode=require&supa=base-pooler.x"
elif [ -n "$DATABASE_URL" ]; then
  TARGET_DATABASE_URL="$DATABASE_URL"
else
  echo "❌ Error: Se requiere la contraseña de la base de datos de Supabase."
  echo "Uso: ./scripts/deploy-supabase.sh \"TU_CONTRASEÑA\""
  exit 1
fi

echo "📦 1. Generando Prisma Client..."
npx prisma generate --schema=apps/api/prisma/schema.prisma

echo "🔄 2. Ejecutando migración de esquemas hacia Supabase..."
DATABASE_URL="$TARGET_DATABASE_URL" npx prisma db push --schema=apps/api/prisma/schema.prisma --accept-data-loss

echo "🌱 3. Ejecutando Seed regulatorio (Países MX/HT, Roles, Catálogo, Cuentas Ledger)..."
DATABASE_URL="$TARGET_DATABASE_URL" npx ts-node -r dotenv/config apps/api/prisma/seed.ts

echo "===================================================================="
echo "✅ Migración y carga inicial en Supabase completadas exitosamente!"
echo "===================================================================="

