import { PartialType } from '@nestjs/swagger';
import { CreateSecurableDto } from './create-securable.dto';

export class UpdateSecurableDto extends PartialType(CreateSecurableDto) {}
