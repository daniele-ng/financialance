import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { IncomingHttpHeaders } from 'http';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSourceTestOptions } from 'src/database/data-source-test';
import { ConfigModule } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { validationExceptionFactory } from 'src/lib/mocks/validation-exception-factory';
import { ValidatorsModule } from 'src/validators/validators.module';
import mockUser, { mockCreateUserDto, mockUser2 } from 'src/lib/mocks/user-mock';
import { CreateUserDto } from 'src/users/users.dto';
import { TokenPairType } from 'src/tokens/@types/tokens-type';

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
        }).compile();        

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

    it('should not access protected page without authentication', () => {

        request(app.getHttpServer())
            .post('/api/user')
            .set(headers)
            .expect(403)

        request(app.getHttpServer())
            .put('/api/user')
            .set(headers)
            .expect(403)

        request(app.getHttpServer())
            .patch('/api/user')
            .set(headers)
            .expect(403)

        request(app.getHttpServer())
            .get('/api/tax-rates')
            .set(headers)
            .expect(403)

        request(app.getHttpServer())
            .post('/api/tax-rate')
            .set(headers)
            .expect(403)

        request(app.getHttpServer())
            .put('/api/tax-rate')
            .set(headers)
            .expect(403)

        request(app.getHttpServer())
            .delete('/api/tax-rate')
            .set(headers)
            .expect(403)

        request(app.getHttpServer())
            .get('/api/invoices')
            .set(headers)
            .expect(403)

        request(app.getHttpServer())
            .get('/api/invoice/1')
            .set(headers)
            .expect(403)

        request(app.getHttpServer())
            .post('/api/invoice')
            .set(headers)
            .expect(403)

        request(app.getHttpServer())
            .put('/api/invoice')
            .set(headers)
            .expect(403)

        request(app.getHttpServer())
            .patch('/api/invoice')
            .set(headers)
            .expect(403)

        request(app.getHttpServer())
            .get('/api/logout')
            .set(headers)
            .expect(403)

        request(app.getHttpServer())
            .get('/api/tokens')
            .set(headers)
            .expect(403)

        request(app.getHttpServer())
            .get('/api/financial-statement')
            .set(headers)
            .expect(403)
    })

    it('should create an account', async () => {

        const response = await request(app.getHttpServer())
            .post('/api/user')
            .set(headers)
            .send(mockCreateUserDto)
            .expect(201)

        const responseBody = response.body

        expect(responseBody.success).toBe(true)
    })

    it('should not pass validation during account creation', async () => {

        const dataDto1: CreateUserDto = {
            first_name: "",
            last_name: "",
            email: "",
            vat_number: "",
            pin: ""
        }

        const response1 = request(app.getHttpServer())
            .post('/api/user')
            .set(headers)
            .send(dataDto1)
            .expect(422)

        expect((await response1).body.errors).toMatchObject({
            first_name: ["Campo obbligatorio"],
            last_name: ["Campo obbligatorio"],
            email: ['Campo obbligatorio'],
            pin: ['Il PIN deve essere composto da 6 numeri'],
            vat_number: ["Campo obbligatorio"]
        })

        const dataDto2: CreateUserDto = {
            first_name: "a",
            last_name: "b",
            email: "bb",
            vat_number: "23",
            pin: "1"
        }

        const response2 = request(app.getHttpServer())
            .post('/api/user')
            .set(headers)
            .send(dataDto2)
            .expect(422)

        expect((await response2).body.errors).toMatchObject({
            email: ['Campo obbligatorio'],
            pin: ['Il PIN deve essere composto da 6 numeri'],
        })
    })

    it('should not login with invalid credentials', async () => {

        const response = request(app.getHttpServer())
            .post('/api/login')
            .set(headers)
            .send({ pin: mockUser2.pin })
            .expect(201)

        const body = (await response).body

        expect(body.success).toBe(false)
        expect(body.error).toContain("Codice PIN non valido")
    })

    it('should login and logout', async () => {

        const response = request(app.getHttpServer())
            .post('/api/login')
            .set(headers)
            .send({ pin: mockUser.pin })
            .expect(201)

        const body = (await response).body

        expect(body.success).toBe(true)

        const response1 = request(app.getHttpServer())
            .get('/api/logout')
            .auth(body.data.access_token, { type: "bearer" })
            .set(headers)            
            .expect(200)

        const body1 = (await response1).body

        expect(body1.success).toBe(true)
    })

    it('should access protected resources', async () => {

        const response = request(app.getHttpServer())
            .post('/api/login')
            .set(headers)
            .send({ pin: mockUser.pin })
            .expect(201)

        const body = (await response).body        

        const tokens: TokenPairType = body.data        

        request(app.getHttpServer())
            .get('/api/tax-rates')
            .auth(tokens.access_token, { type: "bearer" })
            .set(headers)
            .expect(200)

    })

    afterAll(async () => {

        await app.close()

    })

});
