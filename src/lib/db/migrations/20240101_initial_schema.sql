-- ============================================================
-- MIGRACIÓN: Esquema inicial para GLL Members
-- Fecha: 2024-01-01
-- Descripción: Tabla central para miembros del roster
-- Nota: social_links JSONB almacena discord, links, integrations, quote, is_leader
-- ============================================================

-- Crear tabla de miembros
CREATE TABLE IF NOT EXISTS members (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  avatar JSONB NOT NULL DEFAULT '{"src": "", "alt": ""}',
  social_links JSONB NOT NULL DEFAULT '{}',
  faction TEXT NOT NULL CHECK (faction IN ('SOLAR', 'LUNAR', 'NEBULA', 'VOID', 'CHRONO')),
  card_size TEXT NOT NULL DEFAULT 'compact' CHECK (card_size IN ('compact', 'wide', 'NORMAL')),
  visible BOOLEAN NOT NULL DEFAULT true,
  experience JSONB NOT NULL,
  theme JSONB NOT NULL,
  seo JSONB NOT NULL,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para consultas comunes
CREATE INDEX IF NOT EXISTS idx_members_slug ON members(slug);
CREATE INDEX IF NOT EXISTS idx_members_visible ON members(visible);
CREATE INDEX IF NOT EXISTS idx_members_faction ON members(faction);
CREATE INDEX IF NOT EXISTS idx_members_sort_order ON members(sort_order);
CREATE INDEX IF NOT EXISTS idx_members_name ON members(name);
CREATE INDEX IF NOT EXISTS idx_members_social_links ON members USING GIN (social_links);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_members_updated_at ON members;
CREATE TRIGGER update_members_updated_at
  BEFORE UPDATE ON members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();