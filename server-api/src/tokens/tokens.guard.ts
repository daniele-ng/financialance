import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { TokenPayloadType } from 'src/tokens/@types/tokens-type';
import { TokensService } from 'src/tokens/tokens.service';

@Injectable()
export class TokensGuard implements CanActivate {

    constructor(
        private tokensService: TokensService,
    ) { }

    /**
     * Check if a user has a valid refresh token
     * 
     * Protect route /api/backend/tokens
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
        if (await this.tokensService.verify(token) === false) return false        

        // retrieve payload from token
        const tokenPayload: TokenPayloadType | null = await this.tokensService.getPayload(token)

        if (tokenPayload == null) return false

        // only tokens with scope refresh are authorized
        if (tokenPayload.scope != "refresh") return false

        // disable refresh token to prevent reuse
        await this.tokensService.disable(token)

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
