import type { Child, CreateChildDto, UpdateChildDto } from './types.js';

const children: Child[] = [];
let nextId = 1;

export function getAll(): Child[] {
  return children;
}

export function getById(id: number): Child | undefined {
  return children.find((c) => c.id === id);
}

export function create(data: CreateChildDto): Child {
  const newChild: Child = { id: nextId++, ...data };
  children.push(newChild);
  return newChild;
}

export function update(id: number, data: UpdateChildDto): Child | undefined {
  const child = children.find((c) => c.id === id);
  if (!child) {
    return undefined;
  }
  Object.assign(child, data);
  return child;
}

export function remove(id: number): boolean {
  const index = children.findIndex((c) => c.id === id);
  if (index === -1) {
    return false;
  }
  children.splice(index, 1);
  return true;
}