import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { validationExceptionFactory } from './lib/mocks/validation-exception-factory';
import { useContainer } from 'class-validator';
import { ValidatorsModule } from './validators/validators.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {

    const corsOptions = {
        "origin": process.env.CORS_ALLOWED_ORIGIN,
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "credentials": true,
        "preflightContinue": false,
        "optionsSuccessStatus": 204
    }

    const app = await NestFactory.create(AppModule, { cors: corsOptions });

    app.useGlobalPipes(
        new ValidationPipe(
            {
                whitelist: true,
                transform: true,
                exceptionFactory: validationExceptionFactory
            }
        )
    )

    useContainer(app.select(ValidatorsModule), { fallbackOnErrors: true })

    app.use(cookieParser());

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
