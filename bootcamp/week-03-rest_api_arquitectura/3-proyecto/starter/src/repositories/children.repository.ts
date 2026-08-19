import { Child, CreateChildDto, UpdateChildDto } from '../types';

const store: Child[] = [
  { id: 1, name: 'Mariana Gómez', group: 'Sala Cuna', monthlyFee: 450000, active: true, createdAt: new Date().toISOString() },
  { id: 2, name: 'Samuel Rojas', group: 'Maternal', monthlyFee: 420000, active: true, createdAt: new Date().toISOString() },
  { id: 3, name: 'Valentina Ruiz', group: 'Jardín', monthlyFee: 360000, active: true, createdAt: new Date().toISOString() },
];
let nextId = 4;

export async function findAll(): Promise<Child[]> {
  return [...store];
}

export async function findById(id: number): Promise<Child | undefined> {
  return store.find((c) => c.id === id);
}

export async function create(dto: CreateChildDto): Promise<Child> {
  const child: Child = { id: nextId++, ...dto, createdAt: new Date().toISOString() };
  store.push(child);
  return { ...child };
}

export async function update(id: number, dto: UpdateChildDto): Promise<Child | undefined> {
  const index = store.findIndex((c) => c.id === id);
  if (index === -1) return undefined;
  store[index] = { ...store[index]!, ...dto };
  return { ...store[index]! };
}

export async function remove(id: number): Promise<boolean> {
  const index = store.findIndex((c) => c.id === id);
  if (index === -1) return false;
  store.splice(index, 1);
  return true;
}