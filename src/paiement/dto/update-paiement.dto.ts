import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentDto } from './create-paiement.dto';

export class UpdatePaiementDto extends PartialType(CreatePaymentDto) {}
