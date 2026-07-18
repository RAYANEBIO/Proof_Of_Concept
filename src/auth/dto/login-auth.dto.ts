import { PartialType } from '@nestjs/mapped-types';
import {RegisterDto } from './register-auth.dto';
import { IsString, IsNotEmpty } from 'class-validator';

export class loginDto extends PartialType(RegisterDto) {
    @IsString()
    @IsNotEmpty({ message: "L'identifiant (email ou téléphone) est requis" })
    identifier!: string;

    @IsString()
    @IsNotEmpty({ message: 'Le mot de passe est requis' })
    password!: string;
}