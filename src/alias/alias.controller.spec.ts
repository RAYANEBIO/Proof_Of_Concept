import { Test, TestingModule } from '@nestjs/testing';
import { AliasController } from './alias.controller';
import { AliasService } from './alias.service';
import { describe, beforeEach, it } from 'node:test';

describe('AliasController', () => {
  let controller: AliasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AliasController],
      providers: [AliasService],
    }).compile();

    controller = module.get<AliasController>(AliasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
