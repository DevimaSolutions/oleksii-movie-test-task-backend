import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import envConfig from "src/config/env.config";

import { User, UsersService } from "../users";

import { JwtTokens, SignUpDto } from "./dto";
import { UserRole } from "./enums";
import { UserStatus } from "./enums/user-status";
import { IJwtPayload } from "./interfaces";
import { JwtRefreshService } from "./jwt-refresh.service";

@Injectable()
export class AuthService {
  constructor(
    @Inject(envConfig.KEY)
    private config: ConfigType<typeof envConfig>,
    private usersService: UsersService,
    private jwtService: JwtService,
    private jwtRefreshService: JwtRefreshService
  ) {}

  /**
   * @function - Validate authorized user
   * @param payload IJwtPayload
   * @returns Promise<User | null>
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.usersService.findByEmail(email);

      const doPasswordsMatch = await bcrypt.compare(password, user.password);
      if (doPasswordsMatch) {
        return user;
      }
      return null;
    } catch (e) {
      if (e instanceof NotFoundException) {
        // User was not found
        return null;
      }
      throw e;
    }
  }

  /**
   * @function - Validate authorized user
   * @param payload IJwtPayload
   * @returns Promise<User | null>
   */
  async validateUserPayload(payload: IJwtPayload): Promise<User | null> {
    try {
      const user = await this.usersService.findOne(payload.sub);
      return user;
    } catch (e) {
      if (e instanceof NotFoundException) {
        // User was not found
        return null;
      }
      throw e;
    }
  }

  /**
   * @function - Create jwt pair
   * @param user User
   * @param rememberMe boolean, default: true
   * @returns Promise<JwtTokens>
   */
  async createJwtTokenPair(user: User, rememberMe = true): Promise<JwtTokens> {
    const payload: IJwtPayload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: rememberMe
        ? await this.jwtRefreshService.signAsync({ sub: user.id })
        : null,
    };
  }

  /**
   * @function - User sign in
   * @param user User
   * @param rememberMe boolean optional
   * @returns
   */
  async signIn(user: User, rememberMe?: boolean) {
    return this.createJwtTokenPair(user, rememberMe);
  }

  /**
   * @function - User sign up
   * @param signUpPayload SignUpDto
   * @returns  User data and tokens
   */
  async signUp(signUpDto: SignUpDto) {
    const user = await this.usersService.create({
      ...signUpDto,
      status: UserStatus.Active,
      role: UserRole.User,
    });

    const createdUser = await this.usersService.findOne(user.id);

    const tokens = await this.createJwtTokenPair(user);

    return { user: createdUser, tokens };
  }

  /**
   * @function - Refresh access token
   * @param refreshToken string
   * @param rememberMe boolean optional
   * @returns Promise<JwtTokens>
   */
  async refreshAccessToken(refreshToken: string, rememberMe?: boolean) {
    try {
      const result: Pick<IJwtPayload, "sub"> =
        await this.jwtRefreshService.verifyAsync(refreshToken);
      const user = await this.usersService.findOne(result.sub);
      return this.createJwtTokenPair(user, rememberMe);
    } catch {
      throw new BadRequestException();
    }
  }
}
