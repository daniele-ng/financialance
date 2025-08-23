import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { validationExceptionFactory } from './lib/mocks/validation-exception-factory';
import { useContainer } from 'class-validator';
import { ValidatorsModule } from './validators/validators.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });

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

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
