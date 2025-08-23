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
import mockUser, { mockCreateUserDto, } from 'src/lib/mocks/user-mock';
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

    it('should fail form validation while creating invoice', async () => {

        const response1 = request(app.getHttpServer())
            .post('/api/invoice')
            .set(headers)
            .send({})
            .expect(422)

        expect((await response1).body.errors).toMatchObject({
            code: ["Massimo caratteri consentiti 20", "Campo obbligatorio"],
            company: ["Massimo caratteri consentiti 50", "Campo obbligatorio"],
            date: ["Formato data non valido", "Formato data non valido"],
            amount: ["Formato campo non valido"],
            user: ['Associare un utente'],
        })

        const response2 = request(app.getHttpServer())
            .post('/api/invoice')
            .set(headers)
            .send({
                code: "asdfghjklopiuytrewsdfghj",
                company: "x",
                date: "2025-02-31",
                amount: "test",
                user: mockUser
            })
            .expect(422)

        expect((await response2).body.errors).toMatchObject({
            code: ["Massimo caratteri consentiti 20"],
            date: ["Formato data non valido"],
            amount: ["Formato campo non valido"],
        })

        const response3 = request(app.getHttpServer())
            .post('/api/invoice')
            .set(headers)
            .send({
                code: "01/2025",
                company: "y",
                date: "2025-02-02T20:00:00",
                amount: "20",
                user: mockUser
            })
            .expect(422)

        expect((await response3).body.errors).toMatchObject({
            date: ["Formato data non valido"],
            amount: ["Formato campo non valido"],
        })

    })

    it('should create a new invoice', async () => {

        await request(app.getHttpServer())
            .post('/api/user')
            .set(headers)
            .send(mockCreateUserDto)
            .expect(201)

        const userResponse = await request(app.getHttpServer())
            .get('/api/user')
            .set(headers)
            .expect(200)

        const userResponseBody = userResponse.body

        const response = await request(app.getHttpServer())
            .post('/api/invoice')
            .set(headers)
            .send({
                code: "01/2025",
                date: "2025-08-19",
                amount: "120.00",
                company: "ClientCompany",
                user: userResponseBody.data
            })
            .expect(201)

        const body = response.body

        expect(body.success).toBe(true)

    })

    afterAll(async () => {

        await app.close()

    })

});
