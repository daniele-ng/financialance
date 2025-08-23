import { Body, Controller, Get, Patch, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiResponseDataType, ApiResponseType } from 'src/@types/api-response-type';
import { User } from 'src/entities/user.entity';
import { sanitizeHtmlPipe } from 'src/lib/pipes/sanitize-html.pipe';
import { CreateUserDto, UpdatePinUserDto, UpdateUserDto } from './users.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('api')
export class UsersController {

    constructor(
        private usersService: UsersService
    ){}

    /**
     * @method GET
     * @endpoint /api/user
     * 
     * Get user's details
     * 
     * @returns Promise<ApiResponseDataType>
     */
    @UseGuards(AuthGuard)
    @Get('user')
    async getUser(): Promise<ApiResponseDataType> {

        const response: ApiResponseDataType = { success: false, message: "", error: "", data: {} as User }

        try {

            const user: User | null = await this.usersService.getUser()

            response.success = true
            response.data = user

        }
        catch(err) {

            response.error = "Errore server: " + err.message

        }

        return response

    }

    /**
     * @method POST
     * @endpoint /api/user
     * 
     * Create a new user
     * 
     * @param data HTTP request body
     * @returns Promise<ApiResponseType>
     */
    @Post('user')
    @UseInterceptors(NoFilesInterceptor)
    async createUser(@Body(new sanitizeHtmlPipe([])) data: CreateUserDto): Promise<ApiResponseType> {

        const response: ApiResponseType = { success: false, message: "", error: "" }

        try {

            await this.usersService.create(data)

            response.success = true

        }
        catch(err) {

            response.error = "Errore server: " + err.message

        }

        return response

    }

    /**
     * @method PUT
     * @endpoint /api/user
     * 
     * Update user's data
     * 
     * @param data HTTP request body
     * @returns Promise<ApiResponseType>
     */
    @UseGuards(AuthGuard)
    @Put('user')
    @UseInterceptors(NoFilesInterceptor)
    async updateUser(@Body(new sanitizeHtmlPipe([])) data: UpdateUserDto): Promise<ApiResponseType> {

        const response: ApiResponseType = { success: false, message: "", error: "" }

        try {

            await this.usersService.update(data)

            response.success = true

        }
        catch(err) {

            response.error = "Errore server: " + err.message

        }

        return response

    }

    /**
     * @method PATCH
     * @endpoint /api/user
     * 
     * Update user's pin
     * 
     * @param data HTTP request body
     * @returns Promise<ApiResponseType>
     */
    @UseGuards(AuthGuard)
    @Patch('user')
    @UseInterceptors(NoFilesInterceptor)
    async changePin(@Body() data: UpdatePinUserDto): Promise<ApiResponseType> {

        const response: ApiResponseType = { success: false, message: "", error: "" }

        try {

            await this.usersService.setNewPin(data)

            response.success = true

        }
        catch(err) {

            response.error = "Errore server: " + err.message

        }

        return response

    }
}
