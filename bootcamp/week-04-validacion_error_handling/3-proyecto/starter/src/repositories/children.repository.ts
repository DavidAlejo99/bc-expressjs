import { Child } from '../types';

export type CreateChildRepoDto = Omit<Child, 'id' | 'createdAt'>;
export type UpdateChildRepoDto = Partial<CreateChildRepoDto>;

let children: Child[] = [
  { id: 1, name: 'Mariana Gómez', group: 'Sala Cuna', monthlyFee: 450000, active: true, createdAt: new Date() },
  { id: 2, name: 'Samuel Rojas', group: 'Maternal', monthlyFee: 420000, active: true, createdAt: new Date() },
  { id: 3, name: 'Valentina Ruiz', group: 'Jardín', monthlyFee: 360000, active: true, createdAt: new Date() },
];
let nextId = 4;

export async function findAll(): Promise<Child[]> {
  return [...children];
}

export async function findById(id: number): Promise<Child | undefined> {
  return children.find((c) => c.id === id);
}

export async function create(dto: CreateChildRepoDto): Promise<Child> {
  const child: Child = { id: nextId++, ...dto, createdAt: new Date() };
  children.push(child);
  return { ...child };
}

export async function update(id: number, dto: UpdateChildRepoDto): Promise<Child | undefined> {
  const index = children.findIndex((c) => c.id === id);
  if (index === -1) return undefined;
  children[index] = { ...children[index]!, ...dto };
  return { ...children[index]! };
}

export async function remove(id: number): Promise<boolean> {
  const index = children.findIndex((c) => c.id === id);
  if (index === -1) return false;
  children.splice(index, 1);
  return true;
}