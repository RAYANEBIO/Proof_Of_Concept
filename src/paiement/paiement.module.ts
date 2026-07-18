import { Module } from '@nestjs/common';
import { PaymentService } from './paiement.service';
import { PaymentController } from './paiement.controller';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaiementModule {}
