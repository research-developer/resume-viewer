import { z } from "zod";

// Node Types per PLANS.md
export const NodeType = z.enum([
  "Person",
  "Idea",
  "Project",
  "Experiment",
  "Theory",
  "Musing",
  "Skill",
  "Experience",
  "Education",
  "Animal",
  "Media",
  "Website",
  "Tool",
]);
export type NodeType = z.infer<typeof NodeType>;

export const NodeSchema = z.object({
  id: z.string().min(1),
  type: NodeType,
  label: z.string().min(1),
  summary: z.string().min(1),
  tags: z.array(z.string()).default([]),
  assets: z
    .array(
      z.object({
        icon: z.string().min(1), // emoji or short icon name
        url: z.string().url(),
        label: z.string().optional(),
      })
    )
    .optional(),
});
export type IdeaNode = z.infer<typeof NodeSchema>;

// Predicates per PLANS.md
export const Predicate = z.enum([
  "authored",
  "proposes",
  "worked_on",
  "built",
  "holds_degree_in",
  "learned_at_age",
  "role",
  "inspired_by",
  "about",
  "relates_to",
  "category",
  "tag",
  "status",
  "evidence",
]);
export type Predicate = z.infer<typeof Predicate>;

export const TripleMetaSchema = z
  .object({
    weight: z.number().optional(),
    notes: z.string().optional(),
    created: z.string().optional(), // ISO date string
  })
  .default({});

export const TripleSchema = z.object({
  s: z.string().min(1),
  p: Predicate,
  o: z.union([z.string(), z.number(), z.boolean()]),
  meta: TripleMetaSchema.optional(),
});
export type IdeaTriple = z.infer<typeof TripleSchema>;

// Collections
export const NodesArraySchema = z.array(NodeSchema);
export const TriplesArraySchema = z.array(TripleSchema);

// Runtime helpers
export function parseNodes(data: unknown): IdeaNode[] {
  return NodesArraySchema.parse(data);
}

export function parseTriples(data: unknown): IdeaTriple[] {
  return TriplesArraySchema.parse(data);
}
