import type { Child, ChildSummary } from './types.js';

export function filterByCategory(children: Child[], categoryFilter: string | null): Child[] {
  if (categoryFilter === null) {
    return children;
  }

  const filtered = children.filter(
    (c) => c.group.toLowerCase() === categoryFilter.toLowerCase()
  );

  if (filtered.length === 0) {
    const available = [...new Set(children.map((c) => c.group))].join(', ');
    throw new Error(
      `No hay niños en el grupo "${categoryFilter}". Grupos disponibles: ${available}`
    );
  }

  return filtered;
}

export function calculateSummary(children: Child[]): ChildSummary {
  const active = children.filter((c) => c.active).length;
  const inactive = children.filter((c) => !c.active).length;

  const totalFees = children.reduce((sum, c) => sum + c.monthlyFee, 0);
  const averageMonthlyFee = Math.round((totalFees / children.length) * 100) / 100;

  const highestFee = children.reduce((max, c) => (c.monthlyFee > max.monthlyFee ? c : max));
  const lowestFee = children.reduce((min, c) => (c.monthlyFee < min.monthlyFee ? c : min));

  const groups = [...new Set(children.map((c) => c.group))];

  return {
    total: children.length,
    active,
    inactive,
    averageMonthlyFee,
    highestFee,
    lowestFee,
    groups,
  };
}