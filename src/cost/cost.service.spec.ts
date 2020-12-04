import { Test, TestingModule } from '@nestjs/testing';
import { FinalCost, ParamsCost } from './const.interface';
import { CostService } from './cost.service';

describe('CostService', () => {
  let service: CostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CostService],
    }).compile();

    service = module.get<CostService>(CostService);
  });

  it('time < planMinutes', () => {
    const result: FinalCost = service.getCostWithPlan(getCostExample1());
    const result2: FinalCost = service.getCostWithoutPlan(getCostExample1());
    expect(result).toHaveProperty('cost', 0.0);
    expect(result2).toHaveProperty('cost', 38.0);
  });

  it('time = planMinutes', () => {
    const result: FinalCost = service.getCostWithPlan(getCostExample2());
    const result2: FinalCost = service.getCostWithoutPlan(getCostExample2());
    expect(result).toHaveProperty('cost', 0.0);
    expect(result2).toHaveProperty('cost', 114.0);
  });

  it('time > planMinutes', () => {
    const result: FinalCost = service.getCostWithPlan(getCostExample3());
    const result2: FinalCost = service.getCostWithoutPlan(getCostExample3());
    expect(result).toHaveProperty('cost', 20.9);
    expect(result2).toHaveProperty('cost', 247.0);
  });

  it('withPlan: time < 0 | DDD our coverage | plan not found', () => {
    try {
      service.getCostWithPlan(getCostExample4());
    } catch (error) {
      expect(error).toStrictEqual({
        error: {
          messages: [
            'Desculpe, nossos planos não têm cobertura nessa localidade.',
            'Desculpe, o plano selecionado não existe.',
            'Desculpe, o tempo falado deve ser maior que 0.',
          ],
        },
      });
    }
  });

  it('withoutPlan: time < 0 | DDD our coverage | plan not found', () => {
    try {
      service.getCostWithoutPlan(getCostExample4());
    } catch (error) {
      expect(error).toStrictEqual({
        error: {
          messages: [
            'Desculpe, nossos planos não têm cobertura nessa localidade.',
            'Desculpe, o tempo falado deve ser maior que 0.',
          ],
        },
      });
    }
  });

  it('withPlan/WithoutPlan = 1.1', () => {
    const example5 = getCostExample5();
    const result: FinalCost = service.getCostWithPlan(example5);
    const result2: FinalCost = service.getCostWithoutPlan(example5);
    // essa é a tarifa de 11 x 16 nos exatos 30 minutos da franquia oferecida
    const valueWihtouPlan = 30 * 1.9;
    expect((result.cost / (result2.cost - valueWihtouPlan)).toFixed(1)).toBe(
      '1.1',
    );
  });
});

function getCostExample1(): ParamsCost {
  return {
    from: '011',
    to: '016',
    time: 20,
    plan: 'FaleMais 30',
  };
}

function getCostExample2(): ParamsCost {
  return {
    from: '011',
    to: '016',
    time: 60,
    plan: 'FaleMais 60',
  };
}

function getCostExample3(): ParamsCost {
  return {
    from: '011',
    to: '016',
    time: 130,
    plan: 'FaleMais 120',
  };
}

function getCostExample4(): ParamsCost {
  return {
    from: '021',
    to: '036',
    time: -1,
    plan: 'FaleMais 1201',
  };
}

function getCostExample5(): ParamsCost {
  return {
    from: '011',
    to: '016',
    time: 191,
    plan: 'FaleMais 30',
  };
}
