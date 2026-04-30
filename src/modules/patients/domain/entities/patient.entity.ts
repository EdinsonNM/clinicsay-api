export class PatientEntity {
  constructor(
    readonly id: string,
    readonly fullName: string,
    readonly dni: string,
  ) {}
}
