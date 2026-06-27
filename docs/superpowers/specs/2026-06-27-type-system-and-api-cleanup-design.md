# Design — Type system & API cleanup

**Date:** 2026-06-27
**Scope:** `@axyor/family-serve-database` package
**Context:** Phase 2 of package cleanup (phase 1 committed in `9c58e98`).

---

## Goals

1. **(A)** Éliminer la double définition des types en supprimant `interfaces/index.ts`
2. **(D)** Ajouter des limites Zod sur les chaînes et tableaux pour prévenir les abus de stockage
3. **(E)** Centraliser le calcul de `numberOfPeople` en une seule source
4. **(J)** Exposer une méthode légère de listing des groupes (projection sans membres)

---

## A — Suppression de `interfaces/index.ts`

### Problème

`src/interfaces/index.ts` est un doublon complet de `enums.ts` + `types.ts` avec des divergences :
- `IMemberProfile.id` : requis dans le doublon, optionnel dans `types.ts`
- `IGroup.numberOfPeople` : requis dans le doublon, optionnel dans `types.ts`

Rien n'importe ce fichier ; il n'est pas dans la chaîne d'export du package.

### Solution

Supprimer `src/interfaces/index.ts`. Les sources canoniques restent :
- `src/interfaces/enums.ts` — tous les enums
- `src/interfaces/types.ts` — toutes les interfaces
- `src/interfaces/validation.ts` — schemas Zod

Pas de migration d'imports nécessaire (rien ne l'importe).

---

## D — Limites Zod dans `validation.ts`

### Problème

Aucun champ string ou tableau n'a de borne supérieure. Un consommateur peut stocker des données arbitrairement larges.

### Solution

Ajouter `.max()` aux schémas dans `MemberProfileCreateSchema` et `GroupCreateSchema` :

| Champ | Contrainte ajoutée |
|---|---|
| `GroupCreateSchema.name` | `.max(100)` |
| `firstName`, `lastName` | `.max(100)` |
| items dans `allergies[]`, `likes[]`, `dislikes[]`, `cuisinePreferences[]` | `.max(100)` par item |
| taille de `allergies`, `likes`, `dislikes`, `cuisinePreferences` | `.max(50)` items |
| `healthNotes`, `rationale` | `.max(500)` |
| `fastingWindow` | `.max(50)` |
| `reason` (DietaryRestrictionSchema, branche string libre) | `.max(200)` |
| `notes` (DietaryRestrictionSchema) | `.max(200)` |

Les champs numériques (`age`, `weightKg`, `heightCm`, etc.) ont déjà des contraintes via les min/max Mongoose et Zod.

---

## E — `numberOfPeople` : source unique

### Problème

`numberOfPeople` est calculé à trois endroits :
1. Virtual Mongoose sur `groupSchema` — `this.members.length`
2. `transformWithId` dans `utils/transform.ts` — `ret.members.length`
3. Getter `GroupEntity.numberOfPeople` — `this.data.numberOfPeople ?? this.data.members.length`

Le virtual Mongoose n'est jamais accédé directement (le code passe toujours par la sérialisation `toObject()`). Il est donc redondant avec `transformWithId`.

### Solution

1. **Supprimer le virtual** de `groupSchema` dans `group.model.ts`
2. **`transformWithId`** reste la seule source (inchangée) — elle set toujours `numberOfPeople = members.length`
3. **`IGroup.numberOfPeople`** passe de `numberOfPeople?: number` à `numberOfPeople: number` dans `types.ts` (c'est toujours set après sérialisation)
4. **`GroupEntity.numberOfPeople`** : simplifier en `return this.data.numberOfPeople` (le fallback `?? members.length` n'est plus nécessaire)

**Note semver :** passer `numberOfPeople?` → `numberOfPeople` est un breaking change TypeScript pour les consommateurs qui construisent des objets `IGroup` manuellement. Le consommateur `family-serve-delicious` ne le fait pas (il ne fait que lire). Cela justifie un bump `2.x → 3.0.0` lors de la prochaine release.

---

## J — Listing léger des groupes

### Problème

`listGroups()` ramène les documents complets avec tous les profils membres. Le consommateur MCP (tool `groups-summary`) n'utilise que `{ id, name, memberCount }`.

### Solution

Ajouter un nouveau type et une nouvelle méthode, sans modifier l'API existante.

**Nouveau type** dans `types.ts` :
```typescript
export interface IGroupSummary {
  id: string;
  name: string;
  memberCount: number;
  updatedAt: Date;
  createdAt: Date;
}
```

**Nouveau repo** `findAllSummary()` dans `GroupRepository` :
- Projection MongoDB `{ name: 1, updatedAt: 1, createdAt: 1, 'members._id': 1 }` (seul `_id` par membre pour compter)
- `.lean()` pour éviter la sérialisation Mongoose complète
- Retourne `IGroupSummary[]`

**Nouveau service** `listGroupsSummary()` dans `GroupService` :
- Délègue à `repository.findAllSummary()`
- Retourne `IGroupSummary[]`

**Export** : `IGroupSummary` ajouté aux exports publics de `src/index.ts`.

---

## Fichiers impactés

| Fichier | Opération |
|---|---|
| `src/interfaces/index.ts` | **Supprimer** |
| `src/interfaces/types.ts` | Modifier `IGroup.numberOfPeople` (optional → required) ; ajouter `IGroupSummary` |
| `src/interfaces/validation.ts` | Ajouter `.max()` sur tous les champs string/array |
| `src/models/group.model.ts` | Supprimer le virtual `numberOfPeople` |
| `src/repositories/group.repository.ts` | Ajouter `findAllSummary()` |
| `src/services/group.service.ts` | Ajouter `listGroupsSummary()` |
| `src/domain/group.entity.ts` | Simplifier le getter `numberOfPeople` |
| `src/index.ts` | Exporter `IGroupSummary` |

---

## Non-objectifs

- Pas de pagination sur `findAll()` (hors scope)
- Pas de limites sur les champs numériques (déjà contraints par Zod/Mongoose)
- Pas de refonte du `BaseRepository` générique
- Pas de migration des types dans `family-serve-delicious` (consommateur, hors package)
