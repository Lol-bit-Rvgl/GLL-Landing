/**
 * DATABASE LAYER - Member Repository
 *
 * Esta capa abstrae el origen de datos para los miembros.
 * Actualmente lee de src/data/members.ts pero puede evolucionar a:
 * - PostgreSQL
 * - Supabase
 * - Sanity CMS
 * - Mongo DB
 *
 * CUALQUIER cambio de backend solo requiere modificar este archivo.
 */

import type { Member } from "@/types/member";
import { members as staticMembers } from "@/data/members";

/**
 * Opción de configuración del repositorio de datos.
 */
export type RepositoryMode = "static" | "postgresql";

export interface MemberRepository {
  getAll(): Promise<Member[]>;
  getBySlug(slug: string): Promise<Member | null>;
  getByFaction(faction: Member["faction"]): Promise<Member[]>;
  getByOrder(): Promise<Member[]>;
  search(query: string): Promise<Member[]>;
  getVisible(): Promise<Member[]>;
  getHidden(): Promise<Member[]>;
  getOrder(): Promise<number>;
}

/**
 * Repositorio estático - lee del archivo members.ts
 *
 * Usado actualmente como fallback y para desarrollo.
 * El archivo members.ts sigue siendo la fuente de verdad.
 */
export class StaticMemberRepository implements MemberRepository {
  private members: Member[];

  constructor() {
    this.members = staticMembers;
  }

  async getAll(): Promise<Member[]> {
    return this.members.filter((m) => m.visible !== false);
  }

  async getBySlug(slug: string): Promise<Member | null> {
    return this.members.find((m) => m.slug === slug) || null;
  }

  async getByFaction(faction: Member["faction"]): Promise<Member[]> {
    return this.members.filter((m) => m.faction === faction && m.visible !== false);
  }

  async getByOrder(): Promise<Member[]> {
    return [...this.members]
      .filter((m) => m.visible !== false)
      .sort((a, b) => a.order - b.order);
  }

  async search(query: string): Promise<Member[]> {
    const q = query.trim().toLowerCase();
    return this.members.filter(
      (m) =>
        m.visible !== false &&
        `${m.displayName} ${m.role}`.toLowerCase().includes(q),
    );
  }

  async getVisible(): Promise<Member[]> {
    return this.members.filter((m) => m.visible !== false);
  }

  async getHidden(): Promise<Member[]> {
    return this.members.filter((m) => m.visible === false);
  }

  async getOrder(): Promise<number> {
    const max = this.members.reduce((max, m) => Math.max(max, m.order), 0);
    return max + 1;
  }
}

/**
 * Repositorio PostgreSQL (esqueleto para futura implementación)
 *
 * Cuando se implemente PostgreSQL, simplemente reemplazarás
 * StaticMemberRepository con PostgreSQLMemberRepository.
 */
export class PostgreSQLMemberRepository implements MemberRepository {
  private pool: unknown;

  constructor() {
    // Inicialización de pool PostgreSQL
    // this.pool = new Pool({ ... });
  }

  async getAll(): Promise<Member[]> {
    // query: SELECT * FROM members WHERE visible = true ORDER BY "order"
    throw new Error("PostgreSQL repository not implemented");
  }

  async getBySlug(slug: string): Promise<Member | null> {
    // query: SELECT * FROM members WHERE slug = $1
    throw new Error("PostgreSQL repository not implemented");
  }

  async getByFaction(faction: Member["faction"]): Promise<Member[]> {
    // query: SELECT * FROM members WHERE faction = $1 AND visible = true
    throw new Error("PostgreSQL repository not implemented");
  }

  async getByOrder(): Promise<Member[]> {
    // query: SELECT * FROM members WHERE visible = true ORDER BY "order" ASC
    throw new Error("PostgreSQL repository not implemented");
  }

  async search(query: string): Promise<Member[]> {
    // query: SELECT * FROM members WHERE (displayName ILIKE $1 OR role ILIKE $1) AND visible = true
    throw new Error("PostgreSQL repository not implemented");
  }

  async getVisible(): Promise<Member[]> {
    // query: SELECT * FROM members WHERE visible = true
    throw new Error("PostgreSQL repository not implemented");
  }

  async getHidden(): Promise<Member[]> {
    // query: SELECT * FROM members WHERE visible = false
    throw new Error("PostgreSQL repository not implemented");
  }

  async getOrder(): Promise<number> {
    // query: SELECT MAX("order") FROM members
    throw new Error("PostgreSQL repository not implemented");
  }
}

/**
 * Instancia singleton del repositorio.
 * Se configura vía Variable de entorno REPOSITORY_MODE.
 */
let repository: MemberRepository | null = null;

export function getRepository(): MemberRepository {
  if (!repository) {
    const mode = process.env.REPOSITORY_MODE as RepositoryMode | undefined;
    switch (mode) {
      case "postgresql":
        repository = new PostgreSQLMemberRepository();
        break;
      case "static":
      default:
        repository = new StaticMemberRepository();
    }
  }
  return repository;
}

/**
 * Helpers para el repositorio de miembros
 */
export async function getMembers(): Promise<Member[]> {
  return getRepository().getAll();
}

export async function getMember(slug: string): Promise<Member | null> {
  return getRepository().getBySlug(slug);
}

export async function getRosterMembers(): Promise<Member[]> {
  return getRepository().getByOrder();
}

export function resolveMemberSlug(slug: string): string {
  // Aliases para retrocompatibilidad
  if (slug === "mangle-drake") return "mangle";
  if (slug === "darth") return "darth10";
  return slug;
}