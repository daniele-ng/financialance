import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { User } from 'src/entities/user.entity';
import { TokenPayloadType } from 'src/tokens/@types/tokens-type';
import { TokensService } from 'src/tokens/tokens.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private usersService: UsersService,
        private tokensService: TokensService,           
    ){}

    /**
     * Check if the user has the authorization to access a resource
     *      
     * @param context execution context
     * @returns Promise<boolean>
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {

        // Extract Bearer token from http request header
        const request: Request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeader(request)

        if (!token) return false

        // verify token validity
        if (await this.tokensService.verify(token) == false) return false        
        
        // retrieve payload from token
        const tokenPayload: TokenPayloadType | null = await this.tokensService.getPayload(token)

        if (tokenPayload == null) return false

        // only tokens with scope access are authorized
        if (tokenPayload.scope != "access") return false

        // Check if the user exists
        const user: User | null = await this.usersService.getUser(false)

        if (user == null) return false

        // Append User object to the request object
        request['user'] = user     

        return true

    }

    /**
     * Return bearer token from request header, if any
     * 
     * @param request incoming HTTP request
     * @returns string | undefined
     */
    private extractTokenFromHeader(request: Request): string | undefined {

        const [type, token] = request.headers.authorization?.split(' ') ?? []

        return type === "Bearer" ? token : undefined

    }
}
