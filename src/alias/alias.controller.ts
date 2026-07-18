import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AliasService } from './alias.service';
import { CreateAliasDto } from './dto/create-alias.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('alias')
export class AliasController {
  constructor(private readonly aliasService: AliasService) {}

  @Post()
  @UseGuards(JwtAuthGuard) // Sécurise la route
  create(@Body() createAliasDto: CreateAliasDto, @Req() req: any) {
    return this.aliasService.create(createAliasDto, req.user.id);
  }

  @Get('my-aliases')
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req: any) {
    return this.aliasService.findAllUserAliases(req.user.id);
  }
}

