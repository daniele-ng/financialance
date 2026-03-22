import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { IncomingHttpHeaders } from 'http';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSourceTestOptions } from 'src/database/data-source-test';
import { ConfigModule } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { validationExceptionFactory } from 'src/lib/mocks/validation-exception-factory';
import { ValidatorsModule } from 'src/validators/validators.module';
import { AuthGuard } from 'src/auth/auth.guard';
import { randomBytes } from 'crypto';

describe('AppController (e2e)', () => {
    let app: INestApplication<App>;

    const headers: IncomingHttpHeaders = { accept: "application/json", "content-type": "application/json" }

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(AppDataSourceTestOptions),
                AppModule,
                ConfigModule.forRoot(
                    {
                        envFilePath: ".env.test.local",
                        isGlobal: true
                    }
                )
            ],
        })
            .overrideGuard(AuthGuard).useValue(true)
            .compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(new ValidationPipe(
            {
                whitelist: true,
                transform: true,
                exceptionFactory: validationExceptionFactory
            }
        ));

        useContainer(app.select(ValidatorsModule), { fallbackOnErrors: true })

        await app.init();
    });

    it('should fail form validation while creating cost', async () => {

        const response1 = request(app.getHttpServer())
            .post('/api/cost')
            .set(headers)
            .send({})
            .expect(422)

        expect((await response1).body.errors).toMatchObject({
            title: ["Massimo caratteri consentiti 100", "Campo obbligatorio"],
            date: ["Formato data non valido", "Formato data non valido"],
            amount: ["Formato campo non valido"]
        })

        const response2 = request(app.getHttpServer())
            .post('/api/cost')
            .set(headers)
            .send({
                title: randomBytes(110).toString('hex'),                
                date: "2025-02-31",
                amount: "test",
            })
            .expect(422)

        expect((await response2).body.errors).toMatchObject({
            title: ["Massimo caratteri consentiti 100"],
            date: ["Formato data non valido"],
            amount: ["Formato campo non valido"],
        })

    })

    it('should create a new cost', async () => {

        const response = await request(app.getHttpServer())
            .post('/api/cost')
            .set(headers)
            .send({
                title: randomBytes(10).toString('hex'),                
                date: "2025-03-31",
                amount: "20.00",
            })
            .expect(201)

        const body = response.body        

        expect(body.success).toBe(true)

    })

    afterAll(async () => {

        await app.close()

    })

    it('should get a list of costs', async () => {       
    
        const response = await request(app.getHttpServer())
            .get('/api/costs')
            .set(headers)
            .expect(200)

        const body = response.body

        expect(body.success).toBe(true)

        const response1 = await request(app.getHttpServer())
            .get('/api/costs?limit=5&sort=date&sort_direction=ASC&year=2025')
            .set(headers)
            .expect(200)

        const body1 = response1.body

        expect(body1.success).toBe(true)

    })

});
