import type { DoctorProjection } from '../projection/doctor-projection.parser';

export interface GetDoctorDetailQuery {
  id: string;
  projection: DoctorProjection;
}
