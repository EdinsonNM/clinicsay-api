export const SPECIALTY_REPOSITORY = Symbol('SPECIALTY_REPOSITORY');

export interface SpecialtyRecord {
  id: string;
  name: string;
}

export interface SpecialtyRepository {
  list(): Promise<SpecialtyRecord[]>;
  findById(id: string): Promise<SpecialtyRecord | null>;
  create(input: { name: string }): Promise<SpecialtyRecord>;
  update(id: string, input: { name: string }): Promise<SpecialtyRecord>;
  delete(id: string): Promise<void>;
}
