import { Controller, Get, Param, Response } from '@nestjs/common';
import { ComparedCost, ParamsCost } from './const.interface';
import { CostService } from './cost.service';

@Controller('cost')
export class CostController {
  private readonly formatLocale = {
    locale: 'pt-br',
  };
  private readonly formatStyle = {
    style: 'currency',
    currency: 'BRL',
  };
  constructor(private costService: CostService) {}

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
      const costWithPlan: string = this.costService
        .getCostWithPlan(paramsCost)
        .cost.toLocaleString(this.formatLocale.locale, this.formatStyle);
      //o custo final sem o plano
      const costWithoutPlan: string = this.costService
        .getCostWithoutPlan(paramsCost)
        .cost.toLocaleString(this.formatLocale.locale, this.formatStyle);

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
