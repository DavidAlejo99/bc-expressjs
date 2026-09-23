export type UserRole = 'user' | 'admin';

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface TokenPayload {
  sub: string;
  role: UserRole;
}

export type ChildGroup =
  | 'Sala Cuna'
  | 'Maternal'
  | 'Párvulos'
  | 'Pre-jardín'
  | 'Jardín'
  | 'Transición';

export interface CreateChildDto {
  name: string;
  enrollmentCode: string;
  group: ChildGroup;
  monthlyFee: number;
  birthDate: Date;
}

export interface UpdateChildDto {
  name?: string;
  group?: ChildGroup;
  monthlyFee?: number;
  birthDate?: Date;
  active?: boolean;
}
