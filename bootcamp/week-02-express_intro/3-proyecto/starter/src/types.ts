export interface Child {
  id: number;
  name: string;
  group: string;
  monthlyFee: number;
  active: boolean;
}

export type CreateChildDto = Omit<Child, 'id'>;
export type UpdateChildDto = Partial<CreateChildDto>;