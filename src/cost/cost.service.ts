import { Injectable } from '@nestjs/common';
import { AplicationErrors } from 'src/errors.interface';
import { ParamsCost, FinalCost, PlanMinutes, Tariff } from './const.interface';

@Injectable()
export class CostService {
  private readonly tariffs: Tariff[] = [
    {
      from: '011',
      to: '016',
      cost: 1.9,
    },
    {
      from: '016',
      to: '011',
      cost: 2.9,
    },
    {
      from: '011',
      to: '017',
      cost: 1.7,
    },
    {
      from: '017',
      to: '011',
      cost: 2.7,
    },
    {
      from: '011',
      to: '018',
      cost: 0.9,
    },
    {
      from: '018',
      to: '011',
      cost: 1.9,
    },
  ];

  private readonly planMinutes: PlanMinutes[] = [
    {
      plan: 'FaleMais 30',
      minutes: 30,
    },
    {
      plan: 'FaleMais 60',
      minutes: 60,
    },
    {
      plan: 'FaleMais 120',
      minutes: 120,
    },
  ];

  private readonly tariffPercentExtra: number = 1.1;

  getCostWithPlan(costIn: ParamsCost): FinalCost {
    const errors: AplicationErrors = { error: { messages: [] } };
    const appliedTariff = this.tariffs.filter((value) => {
      return value.from == costIn.from && value.to == costIn.to;
    })[0]; //so há um valor possível,por isso, index 0

    const appliedPlan = this.planMinutes.filter((value) => {
      return value.plan == costIn.plan;
    })[0]; //so há um valor possível,por isso, index 0
    let costOut: FinalCost;

    const isTimeNegativeOrZero = costIn.time <= 0;

    if (!appliedTariff) {
      errors.error.messages.push(
        'Desculpe, nossos planos não têm cobertura nessa localidade',
      );
    }

    if (!appliedPlan) {
      errors.error.messages.push('Desculpe, o plano selecionado não existe');
    }

    if (isTimeNegativeOrZero) {
      errors.error.messages.push(
        'Desculpe, o tempo falado deve ser maior que 0',
      );
    }

    if (errors.error.messages.length > 0) {
      throw errors;
    }

    //fim do tratamento de erros

    if (costIn.time <= appliedPlan.minutes) {
      costOut = { cost: 0.0 };
    } else {
      //a quantidade de minutos não cobertos pelo plano
      const minutesNotCovered = costIn.time - appliedPlan.minutes;
      //o valor final a ser cobrado,fora o custo da aquisição do plano
      const cost =
        appliedTariff.cost * this.tariffPercentExtra * minutesNotCovered;
      costOut = { cost };
    }
    return costOut;
  }

  getCostWithoutPlan(costIn: ParamsCost): FinalCost {
    const errors: AplicationErrors = { error: { messages: [] } };
    const appliedTariff = this.tariffs.filter((value) => {
      return value.from == costIn.from && value.to == costIn.to;
    })[0]; //so há um valor possível,por isso, index 0

    const isTimeNegativeOrZero = costIn.time <= 0;

    if (!appliedTariff) {
      errors.error.messages.push(
        'Desculpe, nossos planos não têm cobertura nessa localidade',
      );
    }

    if (isTimeNegativeOrZero) {
      errors.error.messages.push(
        'Desculpe, o tempo falado deve ser maior que 0',
      );
    }

    if (errors.error.messages.length > 0) {
      throw errors;
    }

    //a quantidade de minutos
    const minutesNotCovered = costIn.time;
    //o valor final a ser cobrado
    const cost = appliedTariff.cost * minutesNotCovered;
    const costOut = { cost };
    return costOut;
  }
}
