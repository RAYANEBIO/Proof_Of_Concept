import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAliasDto } from './dto/create-alias.dto';
import { Alias } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class AliasService {
  constructor(private prisma: PrismaService) {}

  async create(createAliasDto: CreateAliasDto, userId: number): Promise<Alias> {
    // 1. Vérifier si cet utilisateur possède déjà cet identifiant de paiement
    const existingPaymentMethod = await this.prisma.alias.findFirst({
      where: {
        userId: userId,
        paymentIdentifier: createAliasDto.paymentIdentifier,
      },
    });

    if (existingPaymentMethod) {
      throw new ConflictException(
        "Vous avez déjà rattaché ce moyen de paiement à un autre alias.",
      );
    }

    // 2. Générer un aliasCode unique automatiquement
    const aliasCode = await this.generateUniqueAliasCode();

    // 3. Enregistrer l'alias en base de données
    return this.prisma.alias.create({
      data: {
        name: createAliasDto.name,
        accountType: createAliasDto.accountType,
        paymentIdentifier: createAliasDto.paymentIdentifier,
        aliasCode: aliasCode,
        userId: userId, // Rattaché à l'utilisateur connecté
      },
    });
  }

  // Fonction utilitaire pour s'assurer que l'aliasCode généré est unique au monde
  private async generateUniqueAliasCode(): Promise<string> {
    let isUnique = false;
    let code = '';

    while (!isUnique) {
      // Génère une chaîne aléatoire majuscule de 8 caractères (ex: ALIAS-A1B2C3D4)
      const randomString = crypto.randomBytes(4).toString('hex').toUpperCase();
      code = `ALIAS-${randomString}`;

      // Vérifie en base si le code existe déjà
      const codeExists = await this.prisma.alias.findUnique({
        where: { aliasCode: code },
      });

      if (!codeExists) {
        isUnique = true;
      }
    }

    return code;
  }

  // Récupérer tous les alias de l'utilisateur connecté
  async findAllUserAliases(userId: number): Promise<Alias[]> {
    return this.prisma.alias.findMany({
      where: { userId },
    });
  }
}
