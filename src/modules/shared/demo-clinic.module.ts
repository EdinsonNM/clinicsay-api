import { Global, Module } from '@nestjs/common';
import { DemoClinicStore } from './demo-clinic.store';

@Global()
@Module({
  providers: [DemoClinicStore],
  exports: [DemoClinicStore],
})
export class DemoClinicModule {}
