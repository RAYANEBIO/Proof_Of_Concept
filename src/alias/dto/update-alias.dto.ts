import { PartialType } from '@nestjs/mapped-types';
import { CreateAliasDto } from './create-alias.dto';

export class UpdateAliasDto extends PartialType(CreateAliasDto) {}
