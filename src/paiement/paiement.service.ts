import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-paiement.dto';
import { Payment, PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async initiatePayment(dto: CreatePaymentDto, userId: number): Promise<Payment> {
    // 1. Récupérer et valider l'alias émetteur
    const senderAlias = await this.prisma.alias.findUnique({
      where: { aliasCode: dto.senderAliasCode },
    });
    if (!senderAlias) {
      throw new NotFoundException("L'alias émetteur n'existe pas.");
    }

    // Vérifier que l'alias émetteur appartient à l'utilisateur connecté
    if (senderAlias.userId !== userId) {
      throw new ForbiddenException("Vous n'êtes pas propriétaire de cet alias émetteur.");
    }

    // 2. Récupérer et valider l'alias récepteur
    const receiverAlias = await this.prisma.alias.findUnique({
      where: { aliasCode: dto.receiverAliasCode },
    });
    if (!receiverAlias) {
      throw new NotFoundException("L'alias récepteur n'existe pas.");
    }

    // Sécurité : On ne peut pas s'envoyer de l'argent à soi-même sur le même alias
    if (senderAlias.id === receiverAlias.id) {
      throw new BadRequestException("Impossible d'effectuer un paiement sur le même alias.");
    }

    // 3. Créer le paiement avec le statut initial EN_COURS
    const payment = await this.prisma.payment.create({
      data: {
        amount: dto.amount,
        status: PaymentStatus.PENDING,
        senderAliasId: senderAlias.id,
        receiverAliasId: receiverAlias.id,
      },
    });

    // 4. Déclencher le traitement externe simulé
    const isSuccess = await this.simulateExternalProviderCall(senderAlias, receiverAlias, dto.amount);

    // 5. Mettre à jour le statut final
    return this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: isSuccess ? PaymentStatus.COMPLETED : PaymentStatus.CANCELLED,
      },
    });
  }

  // Simulation d'un appel API vers une banque ou un opérateur Mobile Money
  private async simulateExternalProviderCall(sender: any, receiver: any, amount: number): Promise<boolean> {
    
    // Log technique pour prouver la valeur métier du concept :
    console.log(`[Banque/Opérateur] Transfert de ${amount} initié.`);
    console.log(`Débit Source (${sender.accountType}) : ${sender.paymentIdentifier}`);
    console.log(`Crédit Cible (${receiver.accountType}) : ${receiver.paymentIdentifier}`);

    // Simulation d'un taux de succès de 90%
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Attente de 1s
    return Math.random() > 0.1;
  }

  // Historique complet pour l'utilisateur (Émis et Reçus) [4.5]
  async getUserPaymentHistory(userId: number, status?: PaymentStatus): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      where: {
        status: status, 
        OR: [
          { senderAlias: { userId: userId } },
          { receiverAlias: { userId: userId } },
        ],
      },
      include: {
        senderAlias: { select: { aliasCode: true, name: true } },
        receiverAlias: { select: { aliasCode: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
