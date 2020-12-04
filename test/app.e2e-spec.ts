import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Sua aplicação está no ar!');
  });

  it('test from 011 to 016 time 20 plan FaleMais  30', (done) => {
    return request(app.getHttpServer())
      .get('/cost/from/011/to/016/time/20/plan/FaleMais 30')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body).toHaveProperty('costWithPlan', 'R$ 0,00');
        expect(res.body).toHaveProperty('costWithoutPlan', 'R$ 38,00');
        return done();
      });
  });

  it('test from 011 to 017 time 80 plan FaleMais 60', (done) => {
    return request(app.getHttpServer())
      .get('/cost/from/011/to/017/time/80/plan/FaleMais 60')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body).toHaveProperty('costWithPlan', 'R$ 37,40');
        expect(res.body).toHaveProperty('costWithoutPlan', 'R$ 136,00');
        return done();
      });
  });

  it('test from 018 to 011 time 200 plan FaleMais 120', (done) => {
    return request(app.getHttpServer())
      .get('/cost/from/018/to/011/time/200/plan/FaleMais 120')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body).toHaveProperty('costWithPlan', 'R$ 167,20');
        expect(res.body).toHaveProperty('costWithoutPlan', 'R$ 380,00');
        return done();
      });
  });

  it('(400-out covered).test from 018 to 017 time 351 plan FaleMais 30', (done) => {
    return request(app.getHttpServer())
      .get('/cost/from/018/to/017/time/351/plan/FaleMais 30')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body).toHaveProperty('error', {
          messages: [
            'Desculpe, nossos planos não têm cobertura nessa localidade.',
          ],
        });
        return done();
      });
  });

  it('(400-plan not found).test from 011 to 017 time 351 plan FaleMais 300', (done) => {
    return request(app.getHttpServer())
      .get('/cost/from/011/to/017/time/351/plan/FaleMais 300')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body).toHaveProperty('error', {
          messages: ['Desculpe, o plano selecionado não existe.'],
        });
        return done();
      });
  });

  it('(400-time negative).test from 011 to 017 time -1 plan FaleMais 30', (done) => {
    return request(app.getHttpServer())
      .get('/cost/from/011/to/017/time/-1/plan/FaleMais 30')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body).toHaveProperty('error', {
          messages: ['Desculpe, o tempo falado deve ser maior que 0.'],
        });
        return done();
      });
  });
  it('(400-time zero).test from 011 to 017 time 0 plan FaleMais 30', (done) => {
    return request(app.getHttpServer())
      .get('/cost/from/011/to/017/time/0/plan/FaleMais 30')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body).toHaveProperty('error', {
          messages: ['Desculpe, o tempo falado deve ser maior que 0.'],
        });
        return done();
      });
  });
  it('(400-multiples errors).test from 017 to 018 time 0 plan FaleMais 300', (done) => {
    return request(app.getHttpServer())
      .get('/cost/from/017/to/018/time/0/plan/FaleMais 300')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body).toHaveProperty('error', {
          messages: [
            'Desculpe, nossos planos não têm cobertura nessa localidade.',
            'Desculpe, o plano selecionado não existe.',
            'Desculpe, o tempo falado deve ser maior que 0.',
          ],
        });
        return done();
      });
  });
});
