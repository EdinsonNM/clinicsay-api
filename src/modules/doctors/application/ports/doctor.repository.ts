export const DOCTOR_REPOSITORY = Symbol('DOCTOR_REPOSITORY');

export interface DoctorCatalogRecord {
  id: string;
  name: string;
  cmp: string;
  specialtyIds: string[];
}

export interface DoctorRepository {
  list(filter?: { specialtyId?: string }): Promise<DoctorCatalogRecord[]>;
  findById(id: string): Promise<DoctorCatalogRecord | null>;
  create(input: {
    name: string;
    cmp: string;
    specialtyIds: string[];
  }): Promise<DoctorCatalogRecord>;
  update(
    id: string,
    input: {
      name?: string;
      cmp?: string;
      specialtyIds?: string[];
    },
  ): Promise<DoctorCatalogRecord>;
  delete(id: string): Promise<void>;
}
