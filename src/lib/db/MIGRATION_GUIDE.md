# Supabase Migration Guide

Este documento describe el proceso para configurar Supabase y migrar datos a producción.

## Paso 1: Crear proyecto Supabase

1. Visitar https://supabase.com/
2. Crear un nuevo proyecto
3. Esperar a que se complete la inicialización

## Paso 2: Ejecutar migraciones SQL

En el SQL Editor de Supabase, ejecutar en orden:

### Migración 1: Esquema de miembros
```sql
-- Archivo: src/lib/db/migrations/20240101_initial_schema.sql
```

### Migración 2: Site Settings
```sql
-- Archivo: src/lib/db/migrations/20240102_site_settings.sql
```

### Migración 3: RLS Policies (REQUERIDO)
```sql
-- Archivo: src/lib/db/migrations/20240104_rls_policies.sql
```

**IMPORTANTE:** Las políticas RLS son críticas para la seguridad. Sin ellas, el service_role puede acceder a todos los datos sin restricción.

## Paso 3: Obtener credenciales

En Supabase → Settings → API:

| Variable | Valor |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | API → Anon Key |
| `SUPABASE_SERVICE_ROLE_KEY` | API → Service Role Key |

## Paso 4: Configurar .env.local

Crear `.env.local` en la raíz del proyecto:

```bash
# Copiar plantilla
cp .env.example .env.local
```

Editar y completar valores:

```env
NEXTAUTH_SECRET=your-secret-key-here
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Generar NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

## Paso 5: Migrar datos

### Local (desarrollo/prueba)

```bash
npm run db:migrate
```

Esto importará:
- 10 miembros desde `src/data/members.ts`
- Configuración por defecto de `site_settings`

### Verificar migración

```bash
# Verificar miembros
npm run db:migrate  # Ver salida "Miembros en base: 10"

# Verificar settings
npm run db:migrate  # Ver salida "Settings encontrados"
```

## Paso 6: Configurar en Vercel

1. Ir a Vercel Dashboard → Project Settings → Environment Variables
2. Agregar variables (elige "Production" como ambiente):

| Name | Value | Type |
|------|-------|------|
| NEXTAUTH_SECRET | [generado] | Secret |
| NEXT_PUBLIC_SUPABASE_URL | [url] | Plain Text |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | [anon key] | Plain Text |
| SUPABASE_SERVICE_ROLE_KEY | [service key] | Secret |

3. Hacer nuevo deploy

## Paso 7: Verificar producción

1. Acceder a `/admin/signin` en el sitio producido
2. Login con:
   - Email: `admin@gll.terminal`
   - Password: `gll_super_admin_2026`
3. Verificar que el dashboard carga correctamente

## Solución de Problemas

### Error: "PostgreSQL es obligatorio en producción"

**Causa:** Variables de entorno no configuradas en Vercel.

**Solución:** Verificar que `NEXT_PUBLIC_SUPABASE_URL` esté configurado en el dashboard de Vercel.

### Error de conexión Supabase

**Causa:** Credenciales incorrectas.

**Solución:** 
1. Verificar que las claves coincidan con las del proyecto Supabase
2. Verificar que `SUPABASE_SERVICE_ROLE_KEY` no esté expuesta al cliente

### Miembros no aparecen

**Causa:** RLS no aplicado o datos no migrados.

**Solución:**
1. Verificar que migraciones SQL se hayan ejecutado
2. Verificar que `npm run db:migrate` se haya ejecutado
3. Verificar que `visible = true` para los miembros

---

## Estructura de Archivos

```
src/lib/db/
├── migrations/
│   ├── 20240101_initial_schema.sql      # Tabla members
│   ├── 20240102_site_settings.sql       # Tabla site_settings
│   ├── 20240103_audit_logs.sql          # Documentación audit logs
│   └── 20240104_rls_policies.sql        # Políticas de seguridad
├── supabase.ts                          # Cliente Supabase
├── repository.ts                        # Repositorio principal
├── postgresql-repository.ts             # Implementación PostgreSQL
├── migrate.ts                           # Script de migración
└── validators.ts                        # Validación de entrada
```

## Seguridad

- ✅ Service role solo accesible desde el servidor
- ✅ RLS rechaza operaciones no autorizadas
- ✅ Validación de entrada en todas las APIs admin
- ✅ Protección de campos críticos (experience, slug)