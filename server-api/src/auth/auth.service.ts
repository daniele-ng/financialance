import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './auth.dto';
import { TokenPairType, TokenPayloadType } from 'src/tokens/@types/tokens-type';
import { TokensService } from 'src/tokens/tokens.service';
import { User } from 'src/entities/user.entity';
import { Token } from 'src/entities/token.entity';
import CheckPassword from 'src/lib/bcrypt/check-password';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private tokensService: TokensService,        
    ){}

    /**
     * Authenticate user
     * 
     * Return access and refresh tokens
     * 
     * @param data dto with required fields to authenticate a user
     * @returns Promise<TokenPairType | null>
     */
    async signIn(data: AuthDto): Promise<TokenPairType | null> {

        const user = await this.usersService.getUser(true)        

        if (user == null) return null

        if (await CheckPassword(data.pin , user.pin) == false) return null         

        // Provide a new token pair
        const tokens: TokenPairType | null = await this.getNewTokens(user)        

        return tokens

    }

    /**
     * Sign out a user from the system and disable all tokens belonging to it
     * 
     * @param user User Entity
     */
    async signOut(user: User): Promise<void> {

        await this.tokensService.disableChain(user)

    }

    /**
     * Provides a new token pair
     * 
     * @param user Authenticated User Entity
     * @returns Promise<TokenPairType>
     */
    async getNewTokens(user: User): Promise<TokenPairType | null> {        

        // Payload for access token
        const payloadAccessToken: TokenPayloadType = { sub: user.id.toString(), scope: "access"}
        // Payload for refresh token
        const payloadRefreshToken: TokenPayloadType = { sub: user.id.toString(), scope: "refresh"}

        // Create tokens
        const accessToken = await this.tokensService.create(payloadAccessToken, process.env.JWT_ACCESS_TOKEN_TIMEOUT)
        const refreshToken = await this.tokensService.create(payloadRefreshToken, process.env.JWT_REFRESH_TOKEN_TIMEOUT)

        // Store tokens in the database
        try {

            await this.tokensService.save({ token: accessToken, scope: "access", user: user })
            await this.tokensService.save({ token: refreshToken, scope: "refresh", user: user })

            return { access_token: accessToken, refresh_token: refreshToken }

        }
        catch (err) {

            return null

        }                

    }

    /**
     * Disable refresh token
     * 
     * @param token refresh token
     */
    async disableRefreshToken(token: Token): Promise<void> {

        await this.tokensService.disable(token)

    }

}
