import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
   @MaxLength(20, { message:'le nom ne peut pas exéder plus de 20 caractères' })
        @IsNotEmpty()
            name!:string;
    
    @MaxLength(10,{message:'le numéro ne peut pas exéder 10 caractères'})
        @IsNotEmpty()
            phoneNumber! : string;

    @IsEmail({}, { message: 'Email invalide' })
        @IsNotEmpty()
            email!: string;

    @MinLength(6, { message: 'Le mot de passe doit faire au moins 6 caractères' })
        @IsNotEmpty()
            password!: string;
}
