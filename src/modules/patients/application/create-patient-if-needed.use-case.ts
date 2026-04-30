import { BadRequestException, Injectable } from '@nestjs/common';
import { DemoClinicStore } from '../../shared/demo-clinic.store';

@Injectable()
export class CreatePatientIfNeededUseCase {
  constructor(private readonly store: DemoClinicStore) {}

  execute(patient: { fullName: string; dni: string }) {
    const existing = this.store.patients.find(
      (item) => item.dni === patient.dni,
    );
    if (existing) throw new BadRequestException('El DNI ya existe');
    const created = { id: `p-${Date.now()}`, ...patient };
    this.store.patients.push(created);
    return created;
  }
}
