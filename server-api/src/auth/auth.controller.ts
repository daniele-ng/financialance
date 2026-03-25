import { Controller, Post, Body, UseInterceptors, UseGuards, Res, Get } from '@nestjs/common';
import { ApiResponseDataType, ApiResponseType } from 'src/@types/api-response-type';
import { TokenPairType } from 'src/tokens/@types/tokens-type';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from './auth.guard';
import { Response } from 'express';
import { TokensGuard } from 'src/tokens/tokens.guard';
import { User } from 'src/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Controller('api')
export class AuthController {

    constructor(
        private authService: AuthService,
        private usersService: UsersService
    ) { }

    /**
     * @method POST
     * @endpoint /api/login
     * 
     * Log the user into the system
     * 
     * @param data HTTP request body
     * @param res HTTP response object
     * @returns Promise<ApiResponseDataType>
     */
    @Post('login')
    @UseInterceptors(NoFilesInterceptor)
    async login(@Body() data: AuthDto, @Res({ passthrough: true }) res: Response): Promise<ApiResponseType> {

        const response: ApiResponseType = { success: false, message: "", error: "" }

        try {

            const tokens: TokenPairType | null = await this.authService.signIn(data)

            if (tokens != null) {

                response.success = true

                this.authService.setHttpOnlyCookie(res, tokens, process.env.HTTP_ONLY_COOKIE_MAXAGE)
            }
            else {

                response.error = "Codice PIN non valido"

            }

        }
        catch (err) {

            response.error = "Errore server. Autenticazione utente fallita: " + err.message

        }

        return response

    }

    /**
     * @method GET
     * @endpoint /api/logout
     * 
     * Log out the user from the system
     *      
     * @returns Promise<ApiResponseType>
     */
    @UseGuards(AuthGuard)
    @Get('logout')
    async logout(@Res({ passthrough: true }) res: Response): Promise<ApiResponseType> {

        const response: ApiResponseType = { success: false, message: "", error: "" }

        const user: User | null = await this.usersService.getUser(false)

        if (user != null) {

            try {

                await this.authService.signOut(user)                

                this.authService.setHttpOnlyCookie(res, {"access_token": "" , "refresh_token": ""} , -1)

                response.success = true

            }
            catch(err) {

                response.error = "Errore server, impossibile effettuare il login: " + err.message

            }

        }
        else {

            response.error = "Errore server, nessun utente risulta registrato"
        }

        return response

    }

    /**
     * @method GET
     * @endpoint /api/tokens
     * 
     * Return a new token pair
     * 
     * @param res HTTP response object     
     * @returns Promise<ApiResponseDataType>
     */
    @UseGuards(TokensGuard)
    @Get('tokens')
    async tokens(@Res({ passthrough:true }) res: Response): Promise<ApiResponseType> {

        const response: ApiResponseType = { success: false, message: "", error: "" }

        const user: User | null = await this.usersService.getUser(false)

        if (user != null) {

            const tokens: TokenPairType | null = await this.authService.getNewTokens(user)

            if (tokens != null) {

                response.success = true

                this.authService.setHttpOnlyCookie(res, tokens, process.env.HTTP_ONLY_COOKIE_MAXAGE)
            }
            else {

                response.error = "Errore server, impossibile creare i tokens per l'autenticazione"

            }

        }
        else {

            response.error = "Errore server, nessun utente risulta registrato"
        }

        return response

    }

}
