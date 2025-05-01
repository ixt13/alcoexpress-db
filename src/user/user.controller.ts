import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authGuard: AuthGuard,
  ) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Post()
  createUser(@Body() data: CreateUserDto) {
    return this.userService.createUser(data);
  }

  @Post('/login')
  async userLogin(
    @Body() loginData: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const { token, refreshToken, statusCode } =
        await this.userService.userLogin(loginData);

      response.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: true,
        sameSite: 'lax',
      });

      return {
        token: token,
      };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  @Get('/cart')
  @UseGuards(AuthGuard)
  getCartItems() {
    return this.userService.getCartItems();
  }

  @Get('/tokenRefresh')
  async getNewToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const { newRefreshToken, newToken } =
        await this.userService.getNewToken(request);

      console.log(newRefreshToken, newToken);
      response.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: true,
        sameSite: 'lax',
      });

      return {
        token: newToken,
      };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
