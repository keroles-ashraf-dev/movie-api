import { faker } from '@faker-js/faker';
import { BaseUserRepo } from 'app/repositories/v1/user.repo';
import { BaseUserRefreshTokenRepo } from 'app/repositories/v1/user.refresh.token.repo';
import { AuthService } from './auth.service';
import { ApiError } from 'helpers/error';
import { ErrorType, HttpStatusCode, UserRole } from 'utils/type';
import User from 'app/models/user.model';
import { BaseJWT } from 'helpers/jwt';
import UserRefreshToken from 'app/models/user.refresh.token.model';

describe('register', () => {
    const mockedUserRefreshTokenRepo: jest.Mocked<BaseUserRefreshTokenRepo> = {
        create: jest.fn(),
        findOne: jest.fn(),
        verifyExpiration: jest.fn(),
        delete: jest.fn(),
    };

    const mockedJWT: jest.Mocked<BaseJWT> = {
        sign: jest.fn(),
        verify: jest.fn(),
    };

    const userId = faker.number.int();
    const username = faker.internet.userName();
    const password = faker.internet.password();
    const accessToken = faker.string.uuid();
    const refreshToken = faker.string.uuid();

    const user = User.build({
        id: userId,
        username: username,
        password: password,
        role: UserRole.USER,
    });

    it('it should throw error if username existed', async () => {
        const mockedUserRepo: jest.Mocked<BaseUserRepo> = {
            findOne: jest.fn().mockResolvedValue(user),
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        const authService = new AuthService(mockedUserRepo, mockedUserRefreshTokenRepo, mockedJWT);

        await expect(authService.register(username, password)).rejects.toThrow(
            new ApiError(ErrorType.GENERAL_ERROR, HttpStatusCode.NOT_FOUND, 'Username is exist', true)
        );
    });

    it('it should throw error if user did not created', async () => {
        const mockedUserRepo: jest.Mocked<BaseUserRepo> = {
            findOne: jest.fn(),
            findAll: jest.fn(),
            create: jest.fn().mockResolvedValue(null),
            update: jest.fn(),
            delete: jest.fn(),
        };
        const authService = new AuthService(mockedUserRepo, mockedUserRefreshTokenRepo, mockedJWT);

        await expect(authService.register(username, password)).rejects.toThrow(
            new ApiError(
                ErrorType.UNKNOWN_ERROR,
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                'User not created. something wrong happened, try again later',
            )
        );
    });

    it('it should throw error if could not generate access token', async () => {
        const mockedUserRepo: jest.Mocked<BaseUserRepo> = {
            findOne: jest.fn(),
            findAll: jest.fn(),
            create: jest.fn().mockResolvedValue(user),
            update: jest.fn(),
            delete: jest.fn(),
        };
        const authService = new AuthService(mockedUserRepo, mockedUserRefreshTokenRepo, mockedJWT);
        authService.isUserPasswordValid = jest.fn().mockResolvedValue(true);
        authService.generateAccessToken = jest.fn().mockReturnValue(null);

        await expect(authService.register(username, password)).rejects.toThrow(
            new ApiError(ErrorType.GENERAL_ERROR, HttpStatusCode.INTERNAL_SERVER_ERROR, 'User created successfully, try to login')
        );
    });

    it('it should throw error if could not create refresh token', async () => {
        const mockedUserRepo: jest.Mocked<BaseUserRepo> = {
            findOne: jest.fn(),
            findAll: jest.fn(),
            create: jest.fn().mockResolvedValue(user),
            update: jest.fn(),
            delete: jest.fn(),
        };
        const authService = new AuthService(mockedUserRepo, mockedUserRefreshTokenRepo, mockedJWT);
        authService.isUserPasswordValid = jest.fn().mockResolvedValue(true);
        authService.generateAccessToken = jest.fn().mockReturnValue(accessToken);
        authService.createRefreshToken = jest.fn().mockResolvedValue(null);

        await expect(authService.register(username, password)).rejects.toThrow(
            new ApiError(ErrorType.GENERAL_ERROR, HttpStatusCode.INTERNAL_SERVER_ERROR, 'User created successfully, try to login')
        );
    });

    it('it should return object of user, access token and refresh token', async () => {
        const mockedUserRepo: jest.Mocked<BaseUserRepo> = {
            findOne: jest.fn(),
            findAll: jest.fn(),
            create: jest.fn().mockResolvedValue(user),
            update: jest.fn(),
            delete: jest.fn(),
        };
        const authService = new AuthService(mockedUserRepo, mockedUserRefreshTokenRepo, mockedJWT);
        authService.isUserPasswordValid = jest.fn().mockResolvedValue(true);
        authService.generateAccessToken = jest.fn().mockReturnValue(accessToken);
        authService.createRefreshToken = jest.fn().mockResolvedValue(refreshToken);

        await expect(authService.register(username, password)).resolves.toEqual({
            user: user,
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    });
});

describe('login', () => {
    const mockedUserRefreshTokenRepo: jest.Mocked<BaseUserRefreshTokenRepo> = {
        create: jest.fn(),
        findOne: jest.fn(),
        verifyExpiration: jest.fn(),
        delete: jest.fn(),
    };

    const mockedJWT: jest.Mocked<BaseJWT> = {
        sign: jest.fn(),
        verify: jest.fn(),
    };

    const userId = faker.number.int();
    const username = faker.internet.userName();
    const password = faker.internet.password();
    const accessToken = faker.string.uuid();
    const refreshToken = faker.string.uuid();

    const user = User.build({
        id: userId,
        username: username,
        password: password,
        role: UserRole.USER,
    });

    it('it should throw error if user not found', async () => {
        const mockedUserRepo: jest.Mocked<BaseUserRepo> = {
            findOne: jest.fn().mockResolvedValue(null),
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        const authService = new AuthService(mockedUserRepo, mockedUserRefreshTokenRepo, mockedJWT);

        await expect(authService.login(username, password)).rejects.toThrow(
            new ApiError(ErrorType.GENERAL_ERROR, HttpStatusCode.NOT_FOUND, 'User not found', true)
        );
    });

    it('it should throw error if user password not valid', async () => {
        const mockedUserRepo: jest.Mocked<BaseUserRepo> = {
            findOne: jest.fn().mockResolvedValue(user),
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        const authService = new AuthService(mockedUserRepo, mockedUserRefreshTokenRepo, mockedJWT);
        authService.isUserPasswordValid = jest.fn().mockResolvedValue(false);

        await expect(authService.login(username, password)).rejects.toThrow(
            new ApiError(ErrorType.GENERAL_ERROR, HttpStatusCode.UNAUTHORIZED, 'Invalid username or password')
        );
    });

    it('it should throw error if could not generate access token', async () => {
        const mockedUserRepo: jest.Mocked<BaseUserRepo> = {
            findOne: jest.fn().mockResolvedValue(user),
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        const authService = new AuthService(mockedUserRepo, mockedUserRefreshTokenRepo, mockedJWT);
        authService.isUserPasswordValid = jest.fn().mockResolvedValue(true);
        authService.generateAccessToken = jest.fn().mockReturnValue(null);

        await expect(authService.login(username, password)).rejects.toThrow(
            new ApiError(ErrorType.GENERAL_ERROR, HttpStatusCode.INTERNAL_SERVER_ERROR, 'something wrong happened, try again later')
        );
    });

    it('it should throw error if could not create refresh token', async () => {
        const mockedUserRepo: jest.Mocked<BaseUserRepo> = {
            findOne: jest.fn().mockResolvedValue(user),
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        const authService = new AuthService(mockedUserRepo, mockedUserRefreshTokenRepo, mockedJWT);
        authService.isUserPasswordValid = jest.fn().mockResolvedValue(true);
        authService.generateAccessToken = jest.fn().mockReturnValue(accessToken);
        authService.createRefreshToken = jest.fn().mockResolvedValue(null);

        await expect(authService.login(username, password)).rejects.toThrow(
            new ApiError(ErrorType.GENERAL_ERROR, HttpStatusCode.INTERNAL_SERVER_ERROR, 'something wrong happened, try again later')
        );
    });

    it('it should return object of user, access token and refresh token', async () => {
        const mockedUserRepo: jest.Mocked<BaseUserRepo> = {
            findOne: jest.fn().mockResolvedValue(user),
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        const authService = new AuthService(mockedUserRepo, mockedUserRefreshTokenRepo, mockedJWT);
        authService.isUserPasswordValid = jest.fn().mockResolvedValue(true);
        authService.generateAccessToken = jest.fn().mockReturnValue(accessToken);
        authService.createRefreshToken = jest.fn().mockResolvedValue(refreshToken);

        await expect(authService.login(username, password)).resolves.toEqual({
            user: user,
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    });
});

describe('refreshToken', () => {
    const mockedUserRepo: jest.Mocked<BaseUserRepo> = {
        findOne: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };
    const mockedUserRefreshTokenRepo: jest.Mocked<BaseUserRefreshTokenRepo> = {
        create: jest.fn(),
        findOne: jest.fn(),
        verifyExpiration: jest.fn(),
        delete: jest.fn(),
    };
    const mockedJWT: jest.Mocked<BaseJWT> = {
        sign: jest.fn(),
        verify: jest.fn(),
    };

    const userId = faker.number.int();
    const username = faker.internet.userName();
    const password = faker.internet.password();
    const accessToken = faker.string.uuid();
    const refreshToken = faker.string.uuid();

    const user = User.build({
        id: userId,
        username: username,
        password: password,
        role: UserRole.USER,
    });
    const userRefreshToken = UserRefreshToken.build({
        token: refreshToken,
        uerId: userId,
        expiryDate: faker.date.future(),
    });

    it('it should throw error if token not found', async () => {
        const mockedUserRefreshTokenRepo: jest.Mocked<BaseUserRefreshTokenRepo> = {
            create: jest.fn(),
            findOne: jest.fn().mockResolvedValue(null),
            verifyExpiration: jest.fn(),
            delete: jest.fn(),
        };
        const authService = new AuthService(mockedUserRepo, mockedUserRefreshTokenRepo, mockedJWT);

        await expect(authService.refreshToken(refreshToken)).rejects.toThrow(
            new ApiError(ErrorType.GENERAL_ERROR, HttpStatusCode.NOT_FOUND, 'Refresh token not found')
        );
    });

    it('it should throw error if token expired', async () => {
        const mockedUserRefreshTokenRepo: jest.Mocked<BaseUserRefreshTokenRepo> = {
            create: jest.fn(),
            findOne: jest.fn().mockResolvedValue(userRefreshToken),
            verifyExpiration: jest.fn().mockReturnValue(false),
            delete: jest.fn(),
        };
        const authService = new AuthService(mockedUserRepo, mockedUserRefreshTokenRepo, mockedJWT);

        await expect(authService.refreshToken(refreshToken)).rejects.toThrow(
            new ApiError(
                ErrorType.GENERAL_ERROR,
                HttpStatusCode.FORBIDDEN,
                'Refresh token has expired. Please make a new login request',
            )
        );
    });

    it('it should throw error if token user not found', async () => {
        const mockedUserRefreshTokenRepo: jest.Mocked<BaseUserRefreshTokenRepo> = {
            create: jest.fn(),
            findOne: jest.fn().mockResolvedValue(userRefreshToken),
            verifyExpiration: jest.fn().mockResolvedValue(true),
            delete: jest.fn(),
        };
        const mockedUserRepo: jest.Mocked<BaseUserRepo> = {
            findOne: jest.fn().mockResolvedValue(null),
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        const authService = new AuthService(mockedUserRepo, mockedUserRefreshTokenRepo, mockedJWT);

        await expect(authService.refreshToken(refreshToken)).rejects.toThrow(
            new ApiError(ErrorType.GENERAL_ERROR, HttpStatusCode.NOT_FOUND, 'User not found')
        );
    });

    it('it should throw error if could not generate access token', async () => {
        const mockedUserRefreshTokenRepo: jest.Mocked<BaseUserRefreshTokenRepo> = {
            create: jest.fn(),
            findOne: jest.fn().mockResolvedValue(userRefreshToken),
            verifyExpiration: jest.fn().mockResolvedValue(true),
            delete: jest.fn(),
        };
        const mockedUserRepo: jest.Mocked<BaseUserRepo> = {
            findOne: jest.fn().mockResolvedValue(user),
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        const authService = new AuthService(mockedUserRepo, mockedUserRefreshTokenRepo, mockedJWT);
        authService.generateAccessToken = jest.fn().mockReturnValue(null);

        await expect(authService.refreshToken(refreshToken)).rejects.toThrow(
            new ApiError(ErrorType.GENERAL_ERROR, HttpStatusCode.INTERNAL_SERVER_ERROR, 'something wrong happened, try again later')
        );
    });

    it('it should return object of user, access token and refresh token', async () => {
        const mockedUserRefreshTokenRepo: jest.Mocked<BaseUserRefreshTokenRepo> = {
            create: jest.fn(),
            findOne: jest.fn().mockResolvedValue(userRefreshToken),
            verifyExpiration: jest.fn().mockResolvedValue(true),
            delete: jest.fn(),
        };
        const mockedUserRepo: jest.Mocked<BaseUserRepo> = {
            findOne: jest.fn().mockResolvedValue(user),
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        const authService = new AuthService(mockedUserRepo, mockedUserRefreshTokenRepo, mockedJWT);
        authService.generateAccessToken = jest.fn().mockReturnValue(accessToken);

        await expect(authService.refreshToken(refreshToken)).resolves.toEqual({
            user: user,
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    });
});