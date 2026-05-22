import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards, Headers, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, UpdateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { RawHeaders, GetUser, RoleProtected, Auth } from './decorators';
import { User } from './entities/user.entity';
import type { IncomingHttpHeaders } from 'node:http';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces';
import { ApiTags } from '@nestjs/swagger';



@ApiTags('Auth')
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

  @Get('check-auth-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user:User
    ) {
    return this.authService.checkAuthStatus(user);
  }


  @Patch(':id')
  @Get('private-rules2')
  @Auth(ValidRoles.admin)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateUserDto) {
    return this.authService.update(id, updateProductDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @GetUser() user: User,
    @GetUser(["email", "fullName"]) userEmail: [],
    @RawHeaders() rawHeader: [],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    return {

      ok: true,
      messsage: "hoal test private",
      user: user,
      userEmail: userEmail,
      rawHeader: rawHeader,
      header: headers
    }
  }
  
  // exemplo sem auth decorator
  @Get('private-rules')
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin, ValidRoles.user)
  @UseGuards(AuthGuard(), UserRoleGuard)
  testingPrivateRouteRules(
    @GetUser() user: User,
  ){
    return {
      ok: true,
      user: user,
    }
  }

  @Get('private-rules2')
  @Auth(ValidRoles.user)
  testingPrivateRouteRules2(
    @GetUser() user: User,
  ){
    return {
      ok: true,
      user: user,
    }
  }
}

