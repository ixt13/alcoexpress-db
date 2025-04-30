import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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
  userLogin(@Body() loginData: LoginUserDto) {
    return this.userService.userLogin(loginData);
  }

  @Get('/cart')
  @UseGuards(AuthGuard)
  getCartItems() {
    return this.userService.getCartItems();
  }
}
