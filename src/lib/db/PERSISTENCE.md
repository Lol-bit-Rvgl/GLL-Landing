# Persistencia del Super Admin

## Estado Actual

El sistema usa una **capa de abstracción de datos** (`MemberRepository`) que soporta múltiples proveedores:

### Producción: PostgreSQL (Recomendado)
- **Cliente:** @supabase/supabase-js
- **Conexión:** Transaction Pooler de Supabase
- **Variables de entorno:** `POSTGRES_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

### Desarrollo: JSON Local
- **Archivo:** `data/members.json` (creado automáticamente)
- **Fallback:** `src/data/members.ts` (archivo estático)

## Estructura de Tablas

### members
```
┌─────────────┬─────────────┬─────────────────────────────────────────┐
│ Campo       │ Tipo        │ Descripción                             │
├─────────────┼─────────────┼─────────────────────────────────────────┤
│ id          │ BIGSERIAL   │ PK                                                              │
│ slug        │ TEXT UNIQUE │ Identificador URL único                                   │
│ display_name│ TEXT        │ Nombre visible                                                    │
│ role        │ TEXT        │ Rol del miembro                                               │
│ status      │ TEXT        │ Estado del miembro                                           │
│ quote       │ TEXT        │ Cita destacada                                                │
│ is_leader   │ BOOLEAN     │ Bandera de líder                                              │
│ discord     │ TEXT        │ ID de Discord                                               │
│ avatar      │ JSONB       │ { src: string, alt?: string, frame?: string }              │
│ description │ TEXT        │ Descripción completa                                          │
│ tags        │ TEXT[]      │ Array de etiquetas                                          │
│ faction     │ TEXT        │ 'ARCHIVE' | 'COMBAT' | 'VOID'                           │
│ sort_order  │ INTEGER     │ Orden de presentación                                     │
│ card_size   │ TEXT        │ 'compact' | 'wide'                                        │
│ visible     │ BOOLEAN     │ Visibilidad en roster                                   │
│ theme       │ JSONB       │ Objeto completo de tema                                 │
│ links       │ JSONB[]     │ [{ kind, label, href, external? }]                        │
│ seo         │ JSONB       │ { title, description, ogImage? }                        │
│ integrations│ JSONB       │ { lanyardUserId?, spotifyEmbedUrl? }                      │
│ experience  │ JSONB       │ { component, kind, capabilities[] }                       │
│ created_at  │ TIMESTAMPTZ │ Fecha de creación                                           │
│ updated_at  │ TIMESTAMPTZ │ Fecha de última actualización                             │
└─────────────┴─────────────┴─────────────────────────────────────────┘
```

### site_settings
```
┌─────────────┬─────────────┬─────────────────────────────────────────┐
│ Campo       │ Tipo        │ Descripción                             │
├─────────────┼─────────────┼─────────────────────────────────────────┤
│ id          │ SERIAL      │ PK                                                              │
│ settings    │ JSONB       │ { siteName?, slogan?, description?, discord? }                    │
│ created_at  │ TIMESTAMPTZ │ Fecha de creación                                           │
│ updated_at  │ TIMESTAMPTZ │ Fecha de última actualización                             │
└─────────────┴─────────────┴─────────────────────────────────────────┘
```

## Migración de Datos

### Pasos manuales

1. **Crear proyecto en Supabase**
   - Ir a [supabase.com](https://supabase.com)
   - Crear nuevo proyecto

2. **Aplicar migraciones SQL**
   ```bash
   # Copiar y pegar los archivos de migración en:
   # Supabase Dashboard → SQL Editor
   ```

3. **Configurar variables de entorno en Vercel**
   - `NEXT_PUBLIC_SUPABASE_URL` - URL del proyecto Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon key
   - `SUPABASE_SERVICE_ROLE_KEY` - Service role key (solo en backend)
   - `NEXTAUTH_SECRET` - Secret para NextAuth

4. **Ejecutar migración**
   ```bash
   # Local (requiere configurar .env.local)
   npx tsx src/lib/db/migrate.ts
   ```

### Comando de migración idempotente

```bash
npm run db:migrate
```

## Variables de Entorno Requeridas

```bash
# NextAuth
NEXTAUTH_SECRET=openssl rand -base64 32

# Supabase (Producción)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Alternativa: PostgreSQL directo
POSTGRES_URL=postgres://user:pass@host:5432/db
```

## Seguridad

- Las operaciones de creación/edición(usan `SUPABASE_SERVICE_ROLE_KEY`)
- Las lecturas usan `NEXT_PUBLIC_SUPABASE_ANON_KEY` (seguro para cliente)
- Todas las consultas usan parámetros preparados automáticamente
- Los campos `slug` y `experience` son read-only para usuarios
- Las APIs administrativas requieren sesión de NextAuth válida

## Límites en Servidores Serverless

### Problemas con JSON en Vercel
- Cold starts reinician el archivo
- Múltiples instancias no comparten filesystem
- Sin transacciones = riesgo de corrupción

### Por qué PostgreSQL funciona
- Base de datos externa compartida
- Conexión pooleada (Transaction Pooler)
- Transacciones ACID
- Replicación automática

## API Routes

| Endpoint | Método | Autenticación | Descripción |
|----------|--------|---------------|-------------|
| `/api/data/members` | GET | Pública | Lista miembros visibles |
| `/api/admin/members` | GET | Requerida | Lista admin (incluye ocultos) |
| `/api/admin/members/[slug]` | PATCH | Requerida | Actualizar miembro |
| `/api/admin/members/[slug]` | DELETE | Requerida | Soft delete |
| `/api/admin/members/[slug]/theme` | PATCH | Requerida | Guardar tema |

## Próximos Pasos

- [ ] Configurar backup automático de Supabase
- [ ] Agregar auditoría (admin_audit_logs)
- [ ] Implementar caché en Redis para read-heavy workloads
- [ ] Agregar tests de integración con base de datos real