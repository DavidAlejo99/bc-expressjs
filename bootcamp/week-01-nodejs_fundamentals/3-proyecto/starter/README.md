# Proyecto Semanal 1 — Jardín Infantil Privado

**Aprendiz:** David Esteban Alejo Baracaldo
**Ficha:** 3228973A
**Dominio asignado:** Jardín infantil privado

## Recurso modelado: Child (niño matriculado)

Este proyecto adapta el procesador de datos genérico a mi dominio asignado. El recurso principal es `Child`, representando a un niño matriculado en el jardín infantil, con los siguientes campos:

- `id`: identificador único
- `name`: nombre del niño
- `group`: salón/grupo al que pertenece (Sala Cuna, Maternal, Párvulos, Pre-jardín, Jardín, Transición)
- `monthlyFee`: mensualidad que pagan los padres
- `active`: si el niño sigue matriculado actualmente

## Funcionalidad implementada

1. Lectura de `data/children.json` con `fs/promises`
2. Resumen del catálogo: total, activos/inactivos, mensualidad promedio, mensualidad más alta/baja
3. Filtro por grupo usando el argumento `--category` (ej. `--category "Jardín"`)
4. Generación de reporte en `output/report.json`
5. Manejo de errores: archivo no encontrado, o grupo sin coincidencias (lista los grupos disponibles)

## Cómo ejecutar

```bash
pnpm install
pnpm dev                          # todos los niños
pnpm dev -- --category "Jardín"   # filtrado por grupo
pnpm build                        # verifica compilación TypeScript estricta
