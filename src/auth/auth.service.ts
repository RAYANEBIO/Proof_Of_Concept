import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { loginDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';


@Injectable()
export class AuthService {
  // Injection du service Prisma ainsi que du jwtservice
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<User> {
    // 1. Vérifier si l'utilisateur existe déjà
    const userExists = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.email },
          { phoneNumber: dto.phoneNumber }
        ]
      }
    });

    if (userExists) {
     if (userExists.email === dto.email) {
        throw new ConflictException('Cet email est déjà utilisé');
      }
      if (userExists.phoneNumber === dto.phoneNumber) {
        throw new ConflictException('Ce numéro de téléphone est déjà utilisé');
      }
    }

    // 2. Créer l'utilisateur dans la base
    const newUser = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        phoneNumber : dto.phoneNumber,
        password: dto.password, 
      },
    });

    return newUser;
  }

  async login(dto: loginDto): Promise<any> {
    // 1. Chercher l'utilisateur par email OU par téléphone
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.identifier },
          { phoneNumber: dto.identifier }
        ]
      }
    });

    // 2. Si l'utilisateur n'existe pas
    if (!user) {
      throw new UnauthorizedException('Identifiants incorrects');
    }
    // 3. Vérifier le mot de passe 
    const isPasswordValid = user.password === dto.password;

    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants incorrects');
    }
    const payload = { sub: user.id, email: user.email };

    // On retourne le token d'accès
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        email: user.email
      }
    };
  }
}