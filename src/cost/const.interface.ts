import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString } from 'class-validator';

export class ParamsCost {
  @IsString()
  @ApiProperty({
    required: true,
    example: '011',
    description: 'O DDD de origem',
  })
  from: string;

  @IsString()
  @ApiProperty({
    required: true,
    example: '018',
    description: 'O DDD de destino',
  })
  to: string;

  @IsInt()
  @ApiProperty({
    required: true,
    example: 20,
    description: 'O tempo da ligação',
  })
  time: number;

  @IsString()
  @ApiProperty({
    required: true,
    example: 'FaleMais 30',
    description: 'O nome do plano',
  })
  plan: string;
}

export class FinalCost {
  @IsNumber()
  @ApiProperty({
    required: true,
    example: 204.5,
    description: 'O custo final da ligação',
  })
  cost: number;
}

export class ComparedCost {
  @IsString()
  @ApiProperty({
    required: true,
    example: 'R$ 204.50',
    description: 'O custo com o plano formatado em reais',
  })
  costWithPlan: string;

  @IsString()
  @ApiProperty({
    required: true,
    example: 'R$ 254.50',
    description: 'O custo sem o plano formatado em reais',
  })
  costWithoutPlan: string;
}

export class Tariff {
  @IsString()
  @ApiProperty({
    required: true,
    example: '011',
    description: 'O DDD de origem',
  })
  from: string;

  @IsString()
  @ApiProperty({
    required: true,
    example: '018',
    description: 'O DDD de destino',
  })
  to: string;

  @IsNumber()
  @ApiProperty({
    required: true,
    example: 1.9,
    description: 'O custo por minuto para origem/destino',
  })
  cost: number;
}

export class PlanMinutes {
  @IsString()
  @ApiProperty({
    required: true,
    example: 'FaleMais 30',
    description: 'O nome do plano',
  })
  plan: string;

  @IsInt()
  @ApiProperty({
    required: true,
    example: 30,
    description: 'a quantidade de minutos da franquia do plano',
  })
  minutes: number;
}
