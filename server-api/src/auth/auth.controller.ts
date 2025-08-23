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
    async login(@Body() data: AuthDto, @Res({ passthrough: true }) res: Response): Promise<ApiResponseDataType> {

        const response: ApiResponseDataType = { success: false, message: "", error: "", data: {} as TokenPairType | null }

        try {

            response.data = await this.authService.signIn(data)

            if (response.data != null) {

                response.success = true

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
    async logout(): Promise<ApiResponseType> {

        const response: ApiResponseType = { success: false, message: "", error: "" }

        const user: User | null = await this.usersService.getUser(false)

        if (user != null) {

            try {

                await this.authService.signOut(user)
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
     * @returns Promise<ApiResponseDataType>
     */
    @UseGuards(TokensGuard)
    @Get('tokens')
    async tokens(): Promise<ApiResponseDataType> {

        const response: ApiResponseDataType = { success: false, message: "", error: "", data: {} as TokenPairType | null }

        const user: User | null = await this.usersService.getUser(false)

        if (user != null) {

            response.data = await this.authService.getNewTokens(user)

            if (response.data != null) {

                response.success = true

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
