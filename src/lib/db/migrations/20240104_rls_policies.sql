-- ============================================================
-- MIGRACIÓN: Row Level Security (RLS) Policies
-- Fecha: 2024-01-04
-- Descripción: Políticas de seguridad a nivel de fila
-- ============================================================

-- ============================================================
-- HABILITAR RLS EN LAS TABLAS
-- ============================================================

ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- POLICIAS PARA LA TABLA members
-- ============================================================

-- Política de lectura para usuarios anónimos
-- Permite leer solo miembros visibles
CREATE POLICY IF NOT EXISTS "members_select_visible" ON members
  FOR SELECT
  USING (visible = true);

-- Política de inserción: SOLO para service_role (admin)
-- Ningún usuario anónimo puede insertar
CREATE POLICY IF NOT EXISTS "members_insert_admin" ON members
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Política de actualización: SOLO para service_role (admin)
-- Ningún usuario anónimo puede actualizar
CREATE POLICY IF NOT EXISTS "members_update_admin" ON members
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Política de borrado: NO permitir borrado físico
-- Solo soft-delete a través del repositorio
CREATE POLICY IF NOT EXISTS "members_delete_disabled" ON members
  FOR DELETE
  USING (false);

-- ============================================================
-- POLICIAS PARA LA TABLA site_settings
-- ============================================================

-- Política de lectura de settings: SOLO service_role (admin)
CREATE POLICY IF NOT EXISTS "site_settings_select_admin" ON site_settings
  FOR SELECT
  TO service_role
  USING (true);

-- Política de inserción de settings: SOLO service_role (admin)
CREATE POLICY IF NOT EXISTS "site_settings_insert_admin" ON site_settings
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Política de actualización de settings: SOLO service_role (admin)
CREATE POLICY IF NOT EXISTS "site_settings_update_admin" ON site_settings
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- NOTAS DE SEGURIDAD
-- ============================================================

/*
ESTADO ACTUAL:
- Las operaciones CRUD se realizan usando el service_role a través del cliente Supabase
- El service_role se configura SOLO en el servidor (next.config.ts y server actions)
- Las rutas de API admin requieren autenticación via NextAuth antes de llamar al repositorio

RECOMENDACIONES FUTURAS:
1. Implementar una tabla de usuarios admin si necesitas control granular de roles
2. Considerar usar Supabase Auth con RLS basado en sesión
3. Agregar triggers de auditoría para cambios sensibles
4. Implementar rate limiting en las rutas API

SEGURIDAD ACTUAL:
✓ Service Role nunca expuesto al cliente
✓ Todas las operaciones admin pasan por servidor verificado
✓ Autenticación NextAuth verifica sesión antes de operar
✓ RLS rechaza operaciones sin service_role
*/