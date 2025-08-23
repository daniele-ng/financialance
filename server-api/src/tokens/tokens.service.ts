import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from 'src/entities/token.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { TokenPairType, TokenPayloadType } from './@types/tokens-type';
import { CreateTokenDto } from './tokens.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class TokensService {

    constructor(
        @InjectRepository(Token)
        private tokenRepository: Repository<Token>,
        private jwtService: JwtService
    ){}

    /**
     * Return a new signed token
     * 
     * @param payload payload to be saved in the JWT token
     * @param timeout token duration
     * @returns Promise<string>
     */
    create(payload: TokenPayloadType, timeout: string): Promise<string> {

        return this.jwtService.signAsync(payload, { issuer: process.env.JWT_TOKEN_ISSUER, expiresIn: timeout })

    }

    /**
     * Save a jwt token in the database
     * 
     * @param data required data to create a new token entity
     * @returns Promise<Token>
     */
    save(data: CreateTokenDto): Promise<Token> {

        const entity: Token = this.tokenRepository.create(
            {
                token: data.token,
                scope: data.scope,
                user: data.user
            }
        )

        return this.tokenRepository.save(entity)

    }

    /**
     * Check if provided token is valid
     * 
     * @param token token to be verified
     * @returns Promise<boolean>
     */
    async verify(token: string): Promise<boolean> {

        try {

            await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET })

        }
        catch(err) {
            
            return false

        }
        
        const tokenEntity: Token | null = await this.tokenRepository.findOneBy({ token: token })

        if (tokenEntity == null) return false

        return tokenEntity.enabled == 1

    }

    /**
     * Return the payload of a valid jwt token, otherwise null
     * 
     * @param token jwt token
     * @returns Promise<TokenPayloadType | null>
     */
    async getPayload(token: string): Promise<TokenPayloadType | null> {

        try {

            return await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET }) as TokenPayloadType

        }
        catch {

            return null

        }

    }

    /**
     * Issue a new token pair to the user
     * 
     * @param user Authenticated User entity
     * @returns Promise<TokenPairType>
     */
    async refresh(user: User): Promise<TokenPairType> {

        // Disable old user's tokens
        await this.disableChain(user)

        // create new access and refresh tokens
        const accessToken = await this.create({ sub: user.id.toString(), scope: "access" }, process.env.JWT_ACCESS_TOKEN_TIMEOUT)
        const refreshToken = await this.create({ sub: user.id.toString(), scope: "refresh" }, process.env.JWT_REFRESH_TOKEN_TIMEOUT)

        // save them
        await this.save({ token: accessToken, scope: "access", user: user })
        await this.save({ token: refreshToken, scope: "refresh", user: user })

        return { access_token: accessToken, refresh_token: refreshToken }

    }

    /**
     * Disable token
     * 
     * @param token Token entity
     * @returns Promise<boolean>
     */
    async disable(token: Token | string): Promise<boolean> {

        if (typeof token == "string") {

            try {

                await this.tokenRepository.update({ token: token }, { enabled: 0 })

            }
            catch {

                return false

            }            

        }
        else {

            token.enabled = 0;

            try {

                await this.tokenRepository.save(token)

            }
            catch {

                return false
            }            

        }
        
        return true

    }

    /**
     * Disable a token chain belonging to an user
     * 
     * @param user User entity
     * @returns Promise<UpdateResult>
     */
    disableChain(user: User): Promise<UpdateResult> {
        
        return this.tokenRepository.update({ user: user }, { enabled: 0 })

    }

    /**
     * Delete disabled tokens
     * 
     * @returns Promise<DeleteResult>
     */
    async deleteDisabled(): Promise<DeleteResult> {

        return this.tokenRepository.delete({ enabled: 0 })

    }



}
