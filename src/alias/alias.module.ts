import { Module } from '@nestjs/common';
import { AliasService } from './alias.service';
import { AliasController } from './alias.controller';

@Module({
  controllers: [AliasController],
  providers: [AliasService],
})
export class AliasModule {}
