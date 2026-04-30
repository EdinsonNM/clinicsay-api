import { AppointmentProjection } from '../projection/appointment-projection.parser';

export interface GetAppointmentDetailQuery {
  id: string;
  projection: AppointmentProjection;
}
