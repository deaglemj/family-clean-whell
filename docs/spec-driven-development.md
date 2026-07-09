# Spec-Driven Development

This project uses a lightweight spec-driven workflow.

## Goal

Every meaningful feature starts with a written spec before implementation.

The spec defines:

- what must be built
- what is explicitly out of scope
- how success is verified
- which files/areas are expected to change

## Workflow

1. Create or update a feature folder under `specs/`.
2. Write `spec.md` before coding.
3. Write `plan.md` to describe the implementation approach.
4. Write `tasks.md` as the execution checklist.
5. Implement only what the spec allows.
6. Verify against the acceptance criteria.
7. Update the spec files if the agreed requirements change.

## Folder pattern

```text
specs/
  000-feature-name/
    spec.md
    plan.md
    tasks.md
```

## Rule for AI-assisted implementation

When using an AI coding tool, point it to the active spec folder and instruct it to:

- follow `spec.md` as the source of truth
- use `plan.md` for implementation direction
- complete `tasks.md` step by step
- avoid adding features not described in the spec
- stop if a requirement is unclear or impossible

## Definition of Done

A feature is complete when:

- all tasks are checked off
- all acceptance criteria pass
- relevant documentation is updated
- the app still runs as a static GitHub Pages-compatible webapp
