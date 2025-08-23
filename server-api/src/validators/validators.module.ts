import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { IsUserAlreadyExistConstraint } from './is-user-already-exist';
import { EntityExistsConstranint } from './entity-exists';

@Module({
    providers: [IsUserAlreadyExistConstraint, EntityExistsConstranint],
    imports: [UsersModule],    
})
export class ValidatorsModule {}
