import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('API De Gestion Admin De Citas ClinicSay')
  .setDescription(
    'Contrato ClinicSay para citas admin con proyecciones seguras.',
  )
  .setVersion('0.1.0')
  .build();
