import { AccountType } from "@prisma/client";
import { IsString, IsNotEmpty, IsEnum } from "class-validator";

export class CreateAliasDto {
    @IsString()
  @IsNotEmpty({ message: "Le nom de l'alias est requis" })
  name!: string;

  @IsEnum(AccountType, { message: "Le type de compte doit être BANK ou MOBILE_MONEY" })
  @IsNotEmpty()
  accountType!: AccountType;

  @IsString()
  @IsNotEmpty({ message: "L'identifiant de paiement (IBAN ou Téléphone) est requis" })
  paymentIdentifier!: string;
}
