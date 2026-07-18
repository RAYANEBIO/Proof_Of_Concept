import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './paiement.controller';
import { PaymentService } from './paiement.service';
import { describe, beforeEach, it } from 'node:test';

describe('PaiementController', () => {
  let controller: PaymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [PaymentService],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
