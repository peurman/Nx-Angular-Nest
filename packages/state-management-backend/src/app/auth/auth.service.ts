import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtInfo } from './interfaces/jwtinfo.type';
import {
  hashData,
  signToken,
  validateCode,
} from './utils/jwt.util';
import { SignInDto } from './dto/sigin.dto';
import { UsersService } from '../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(credentials: SignInDto) {
    const user = await this.userService.findOneByEmail(credentials.email);

    await validateCode(user.password, credentials.password);

    await this.userService.changeUserLogState(user.userId, true);

    const tokens = await this.getTokens(user.userId, user.username, user.role);
    await this.updateRefreshToken(user.userId, tokens.refreshToken);

    return {
      status: 'OK',
      message: 'Login successful',
      userInfo: {
        email: credentials.email,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      },
    };
  }

  async signOut(userInfo: JwtInfo) {
    const user = await this.userService.findOne(userInfo.sub);

    await this.userService.changeUserLogState(user.userId, false);

    return {
      status: 'OK',
      message: 'Logout successful',
      data: [{ userId: userInfo.sub }],
    };
  }

  async signUp(userInfo: CreateUserDto): Promise<User> {
    userInfo.password = await hashData(userInfo.password);
    return this.userService.create(userInfo);
  }

  async changeRole(
    currentUser: JwtInfo,
    userId: string,
    newRole: string,
  ) {
    const user = await this.userService.findOne(userId);

    if (currentUser.sub !== user.userId) {
      return this.userService.updateRole(user.userId, newRole);
    } else {
      throw new ConflictException(
        "Can't change your own role, ask another admin for help",
      );
    }
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await hashData(refreshToken);
    await this.userService.update(userId, {
      refresh_token: hashedRefreshToken,
    });
  }

  async getTokens(userId: string, username: string, role: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          role: role
        },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          role: role
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }


  async createAdminUser(): Promise<void> {
    const users = await this.userService.findAll();

    if (users.length === 0) {
      const adminUser: CreateUserDto = {
        email: 'admin@email.com',
        username: 'admin',
        password: 'admin',
      };

      const currentUser: JwtInfo = {
        sub: '0',
        iat: 0,
        exp: 0,
      };

      const admin = await this.signUp(adminUser);

      await this.changeRole(currentUser, admin.userId, 'admin');
    }
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userService.findOne(userId);

    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    const refreshTokenMatches = await validateCode(user.refreshToken, refreshToken);

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.userId, user.username, user.role);
    await this.updateRefreshToken(user.userId, tokens.refreshToken);

    return tokens;
  }
}
