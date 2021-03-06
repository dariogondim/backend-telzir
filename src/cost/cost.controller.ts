import { Controller, Get, Header, Param, Response } from '@nestjs/common';
import { ComparedCost, ParamsCost } from './const.interface';
import { CostService } from './cost.service';
import { formatDecimalValuesToBr } from '../util';

import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  OUT_COVERAGE,
  INVALID_PLAN,
  INVALID_TIME,
} from './const.validations.errors';

@Controller('cost')
export class CostController {
  constructor(private costService: CostService) {}

  @ApiTags('costs')
  @ApiOperation({
    summary:
      'Retorna um comparativo entre os custos das ligações com ou sem plano',
  })
  @ApiOkResponse({ description: 'OK.', type: ComparedCost })
  @ApiBadRequestResponse({
    description: `${OUT_COVERAGE}\n${INVALID_PLAN}\n${INVALID_TIME}`,
  })
  @ApiParam({
    name: 'from',
    type: String,
    required: true,
    description: 'O DDD de origem',
    allowEmptyValue: false,
    example: '011',
  })
  @ApiParam({
    name: 'to',
    type: String,
    required: true,
    description: 'O DDD de destino',
    allowEmptyValue: false,
    example: '018',
  })
  @ApiParam({
    name: 'time',
    type: Number,
    required: true,
    description: 'O tempo de ligação',
    allowEmptyValue: false,
    example: 200,
  })
  @ApiParam({
    name: 'plan',
    type: String,
    required: true,
    description: 'O plano aplicado',
    allowEmptyValue: false,
    example: 'FaleMais 30',
  })
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Methods', 'POST,GET,OPTION')
  @Header('Access-Control-Allow-Headers', '*')
  @Header('Access-Control-Max-Age', '86400')
  @Get('from/:from/to/:to/time/:time/plan/:plan')
  getCoast(@Param() params, @Response() response): ComparedCost {
    const { from, to, time, plan } = params;
    const paramsCost: ParamsCost = {
      from,
      to,
      time,
      plan,
    };

    try {
      //o custo final com plano
      const costWithPlan: string = formatDecimalValuesToBr(
        this.costService.getCostWithPlan(paramsCost).cost,
      );
      //o custo final sem o plano
      const costWithoutPlan: string = formatDecimalValuesToBr(
        this.costService.getCostWithoutPlan(paramsCost).cost,
      );

      const comparedCost: ComparedCost = {
        costWithPlan,
        costWithoutPlan,
      };
      return response.status(200).send(comparedCost);
    } catch (error) {
      return response.status(400).send(error);
    }
  }
}
