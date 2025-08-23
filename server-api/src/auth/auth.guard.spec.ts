
// authGuard.test.ts
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from './auth.guard'; // Adjust the path to where your AuthGuard class is located
import { Request } from 'express';
import { TokenPayloadType } from 'src/tokens/@types/tokens-type';
import mockUser from 'src/lib/mocks/user-mock';



// Mock TokensService
const tokensService = {
  verify: jest.fn(),
  getPayload: jest.fn()
};

// Mock UsersService
const usersService = {
    getUser: jest.fn()
}

const mockRequest = (headers: object) => ({
  headers,
});

const mockExecutionContext = (request: Request) => ({
  switchToHttp: () => ({

    getRequest: () => request

  })  
}) as unknown as ExecutionContext;

describe('AuthGuard', () => {

  let authGuard: AuthGuard;

  beforeEach(() => {

    authGuard = new AuthGuard(tokensService as any, usersService as any);

  });

  test('should return true for valid token with scope access', async () => {

    const request = mockRequest({ authorization: 'Bearer validToken' });
    const context = mockExecutionContext(request as Request);

    const payloadAccessToken: TokenPayloadType = { sub: mockUser.id.toString(), scope: "access" }

    tokensService.verify.mockResolvedValue(true);
    tokensService.getPayload.mockReturnValue(payloadAccessToken)

    usersService.getUser.mockResolvedValueOnce(mockUser)

    const result = await authGuard.canActivate(context);

    expect(result).toBe(true);    

  });

  test('should return false for missing token', async () => {
    
    const request = mockRequest({});
    const context = mockExecutionContext(request as Request);

    expect(await authGuard.canActivate(context)).toBe(false)

  });

  test('should return false for invalid token', async () => {

    const request = mockRequest({ authorization: 'Bearer invalidToken' });
    const context = mockExecutionContext(request as Request);

    tokensService.verify.mockResolvedValue(false);

    expect(await authGuard.canActivate(context)).toBe(false);
  });

  test('should return false for token with incorrect scope', async () => {
    const request = mockRequest({ authorization: 'Bearer invalidToken' });
    const context = mockExecutionContext(request as Request);

    const payloadRefreshToken: TokenPayloadType = { sub: mockUser.id.toString(), scope: "refresh" }

    tokensService.verify.mockResolvedValue(true);
    tokensService.getPayload.mockReturnValue(payloadRefreshToken)    

    expect(await authGuard.canActivate(context)).toBe(false);

    
  });

  test('should return false disabled user', async () => {

    const request = mockRequest({ authorization: 'Bearer invalidToken' });
    const context = mockExecutionContext(request as Request);

    const payloadAccessToken: TokenPayloadType = { sub: mockUser.id.toString(), scope: "access" }

    tokensService.verify.mockResolvedValue(true);
    tokensService.getPayload.mockReturnValue(payloadAccessToken)

    mockUser.enabled = 0
    
    usersService.getUser.mockResolvedValueOnce(mockUser)

    expect(await authGuard.canActivate(context)).toBe(false);

    
  });

});
