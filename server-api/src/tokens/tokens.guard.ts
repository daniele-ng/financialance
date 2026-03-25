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

        // Extract refresh token from cookie
        const request: Request = context.switchToHttp().getRequest()
        const token: string | undefined = request.cookies?.['refresh_token'] ?? undefined

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

}
