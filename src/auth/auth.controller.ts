import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards, Headers  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, UpdateUserDto, LoginUserDto  } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { RawHeaders, GetUser } from './decorators';
import { User } from './entities/user.entity';
import type { IncomingHttpHeaders } from 'node:http';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
    loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }


  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateUserDto) {
    return this.authService.update(id, updateProductDto);
  }

   @Get('private')
   @UseGuards(AuthGuard())
    testingPrivateRoute(
      @GetUser() user:User,
      @GetUser(["email","fullName"]) userEmail:[],
      @RawHeaders() rawHeader:[],
      @Headers() headers: IncomingHttpHeaders,
    ) {
    return {

      ok: true,
      messsage:"hoal test private",
      user:user,
      userEmail:userEmail,
      rawHeader:rawHeader,
      header:headers
    }
  }
}

