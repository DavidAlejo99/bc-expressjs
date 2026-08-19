import { readChildren } from './reader.js';
import { filterByCategory, calculateSummary } from './processor.js';
import { writeReport } from './writer.js';
import type { Report } from './types.js';

async function main(): Promise<void> {
  try {
    const args = process.argv.slice(2);
    const categoryIndex = args.indexOf('--category');
    const categoryFilter: string | null = categoryIndex !== -1 ? args[categoryIndex + 1] : null;

    const allChildren = await readChildren();
    const filteredChildren = filterByCategory(allChildren, categoryFilter);
    const summary = calculateSummary(filteredChildren);

    const report: Report = {
      generatedAt: new Date().toISOString(),
      appliedFilter: categoryFilter,
      summary,
      children: filteredChildren,
    };

    console.log('=== Reporte Jardín Infantil ===');
    console.log(`Filtro aplicado: ${categoryFilter ?? 'ninguno'}`);
    console.log(`Total niños:      ${summary.total}`);
    console.log(`Activos:          ${summary.active}`);
    console.log(`Inactivos:        ${summary.inactive}`);
    console.log(`Mensualidad prom: $${summary.averageMonthlyFee}`);
    console.log(`Grupos:           ${summary.groups.join(', ')}`);
    console.log(`Mensualidad más alta: ${summary.highestFee.name} ($${summary.highestFee.monthlyFee})`);
    console.log(`Mensualidad más baja: ${summary.lowestFee.name} ($${summary.lowestFee.monthlyFee})`);

    await writeReport(report);
  } catch (err) {
    console.error('❌ Error:', err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

main();