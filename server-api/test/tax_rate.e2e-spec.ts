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

    it('should fail form validation while creating tax rate', async () => {

        const response1 = request(app.getHttpServer())
            .post('/api/tax-rate')
            .set(headers)
            .send({
                advanceTaxPayment: "",
                inps: "",
                revenue: "",
                tax: "",
                year: ""
            })
            .expect(422)

        expect((await response1).body.errors).toMatchObject({
            revenue: ["Campo obbligatorio"],
            tax: ["Campo obbligatorio"],
            inps: ["Campo obbligatorio"],
            advanceTaxPayment: ['Campo obbligatorio'],
            year: ['Formato anno non valido'],
        })

        const response2 = request(app.getHttpServer())
            .post('/api/tax-rate')
            .set(headers)
            .send({
                revenue: "101",
                tax: "301",
                inps: "202",
                advanceTaxPayment: "120",
                year: "20"
            })
            .expect(422)

        expect((await response2).body.errors).toMatchObject({
            revenue: ["Il campo deve contenere un valore tra 0 e 100"],
            tax: ["Il campo deve contenere un valore tra 0 e 100"],
            inps: ["Il campo deve contenere un valore tra 0 e 100"],
            advanceTaxPayment: ['Il campo deve contenere un valore tra 0 e 100'],
            year: ['Formato anno non valido'],
        })

    })

    it('should create a new tax rate', async () => {

        const response = await request(app.getHttpServer())
            .post('/api/tax-rate')
            .set(headers)
            .send({
                revenue: "68",
                tax: "5",
                inps: "23.30",
                advanceTaxPayment: "80",
                year: "2025"
            })
            .expect(201)

        const body = response.body

        expect(body.success).toBe(true)

    })

    afterAll(async () => {

        await app.close()

    })

});
