import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AliasModule } from './alias/alias.module';
import { PaiementModule } from './paiement/paiement.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Rend les variables d'environnement accessibles partout
    }),UserModule, AuthModule, AliasModule, PaiementModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
