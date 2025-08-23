import { TokensGuard } from './tokens.guard';
import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { TokenPayloadType } from 'src/tokens/@types/tokens-type';
import mockUser from 'src/lib/mocks/user-mock';

// Mock TokensService
const tokensService = {
    verify: jest.fn(),
    getPayload: jest.fn(),
    disable: jest.fn()
};

const mockRequest = (headers: object) => ({
    headers,
});

const mockExecutionContext = (request: Request) => ({
    switchToHttp: () => ({

        getRequest: () => request

    })
}) as unknown as ExecutionContext;


describe('TokensGuard', () => {

    let tokensGuard: TokensGuard

    beforeEach(() => {

        tokensGuard = new TokensGuard(tokensService as any)

    })

    test('should return true for valid token with scope refresh', async () => {

        const request = mockRequest({ authorization: 'Bearer validToken' });
        const context = mockExecutionContext(request as Request);

        const payloadAccessToken: TokenPayloadType = { sub: mockUser.id.toString(), scope: "refresh" }

        tokensService.verify.mockResolvedValueOnce(true)
        tokensService.getPayload.mockReturnValueOnce(payloadAccessToken)
        tokensService.disable.mockResolvedValueOnce(true)

        expect(await tokensGuard.canActivate(context)).toBe(true);

    });

    test('should return false for missing token', async () => {

        const request = mockRequest({});
        const context = mockExecutionContext(request as Request);

        expect(await tokensGuard.canActivate(context)).toBe(false)

    });

    test('should return false for invalid token', async () => {

        const request = mockRequest({ authorization: 'Bearer invalidToken' });
        const context = mockExecutionContext(request as Request);

        tokensService.verify.mockResolvedValueOnce(false);

        expect(await tokensGuard.canActivate(context)).toBe(false);
    });

    test('should return false for token with incorrect scope', async () => {
        const request = mockRequest({ authorization: 'Bearer invalidToken' });
        const context = mockExecutionContext(request as Request);

        const payloadRefreshToken: TokenPayloadType = { sub: mockUser.id.toString(), scope: "access" }

        tokensService.verify.mockResolvedValue(true);
        tokensService.getPayload.mockReturnValue(payloadRefreshToken)

        expect(await tokensGuard.canActivate(context)).toBe(false);


    });

});
