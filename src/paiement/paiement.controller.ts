import { Controller, Post, Body, Get, Query, UseGuards, Req } from '@nestjs/common';
import { PaymentService } from './paiement.service';
import { CreatePaymentDto } from './dto/create-paiement.dto';
import { PaymentStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('send')
  @UseGuards(JwtAuthGuard)
  emitPayment(@Body() createPaymentDto: CreatePaymentDto, @Req() req: any) {
    return this.paymentService.initiatePayment(createPaymentDto, req.user.id);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  getHistory( @Req() req: any,@Query('status') status?: PaymentStatus) {
    return this.paymentService.getUserPaymentHistory(req.user.id, status);
  }
}
