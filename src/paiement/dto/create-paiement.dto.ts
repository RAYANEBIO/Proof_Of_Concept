import { IsNotEmpty, IsNumber, IsString, IsPositive } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty({ message: "L'alias émetteur est requis" })
  senderAliasCode!: string;

  @IsString()
  @IsNotEmpty({ message: "L'alias récepteur est requis" })
  receiverAliasCode!: string;

  @IsNumber()
  @IsPositive({ message: "Le montant doit être supérieur à 0" })
  amount!: number;
}
