
// authGuard.test.ts
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from './auth.guard'; // Adjust the path to where your AuthGuard class is located
import { Request } from 'express';
import { TokenPayloadType } from 'src/tokens/@types/tokens-type';
import mockUser from 'src/lib/mocks/user-mock';

describe('AuthGuard', () => {

  let authGuard: AuthGuard;
  let mockTokensService: any
  let mockUsersService: any   

  const mockRequest = (cookies: object) => ({
    cookies,
  });

  const mockExecutionContext = (request: Request) => ({
    switchToHttp: () => ({

      getRequest: () => request

    })  
  }) as unknown as ExecutionContext;

  beforeEach(() => {

    // Mock mockTokensService
    mockTokensService = {
      verify: jest.fn(),
      getPayload: jest.fn()
    };

    // Mock mockUsersService
    mockUsersService = {
        getUser: jest.fn()
    }

    authGuard = new AuthGuard(mockUsersService, mockTokensService);

  });

  it('should return true for valid token with scope access', async () => {

    const payloadAccessToken: TokenPayloadType = { sub: mockUser.id.toString(), scope: "access" }    
    const request = mockRequest({ access_token: "access_token" });
    const context = mockExecutionContext(request as Request);

    mockTokensService.verify.mockResolvedValue(true);
    mockTokensService.getPayload.mockReturnValue(payloadAccessToken)

    mockUsersService.getUser.mockResolvedValueOnce(mockUser)

    const result = await authGuard.canActivate(context);

    expect(result).toBe(true);    

  });

  it('should return false for missing token', async () => {
    
    const request = mockRequest({});
    const context = mockExecutionContext(request as Request);

    expect(await authGuard.canActivate(context)).toBe(false)

  });

  it('should return false for invalid token', async () => {

    const request = mockRequest({ access_token: "access_token" });
    const context = mockExecutionContext(request as Request);

    mockTokensService.verify.mockResolvedValue(false);

    expect(await authGuard.canActivate(context)).toBe(false);
  });

  it('should return false for token with incorrect scope', async () => {
    const request = mockRequest({ access_token: "access_token" });
    const context = mockExecutionContext(request as Request);

    const payloadRefreshToken: TokenPayloadType = { sub: mockUser.id.toString(), scope: "refresh" }

    mockTokensService.verify.mockResolvedValue(true);
    mockTokensService.getPayload.mockReturnValue(payloadRefreshToken)    

    expect(await authGuard.canActivate(context)).toBe(false);

    
  });

});
