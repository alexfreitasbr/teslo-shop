import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, LoginUserDto  } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import *as bcrypt from 'bcrypt';
import { JwtPayLoad } from './interfaces';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class AuthService {

  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,

  ) { }

  async create(createUSerDto: CreateUserDto) {
    try {

      const { password, ...userDto } = createUSerDto;

      const user = this.userRepository.create({
        ...userDto,
        password: bcrypt.hashSync(password, 10)
      });

      await this.userRepository.save(user);

      delete (user as any).password;

      
      return {
      ...user,
      token: this.getJwtToken({id: user.id})
    }

    } catch (error: any) {
      this.handleExeptions(error);
    }
  }

  async  login(loginUserDto: LoginUserDto) {

    const {password, email} = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { password: true, id: true}
    })

    if(!user) throw new UnauthorizedException('Credentials are not valid(email')

    if(!bcrypt.compareSync(password,user.password)) throw new UnauthorizedException('Credentials are not valid(password')

    
    return {
      ...user,
      token: this.getJwtToken({id: user.id})
    }
  }

  // findAll() {
  //   return `This action returns all auth`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  async update(id: string, updateUserDto: UpdateUserDto) {
      console.log(updateUserDto)

    const { password, ...userDto } = updateUserDto;

    if (password) {
      updateUserDto.password = bcrypt.hashSync(password, 10);
    }

    try {
      const user = this.userRepository.create(updateUserDto);
      await this.userRepository.update(id, user);
      return `This action updates a #${id} auth`;

    } catch (error: any) {
      this.handleExeptions(error);
    }
  }

  async remove(id: number) {
    
    return `This action removes a #${id} auth`;
  }

  private handleExeptions(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

  private getJwtToken(payload: JwtPayLoad){

    const token = this.jwtService.sign( payload );
    return token;

  }

  async checkAuthStatus(user:User){
    return {
      ...user,
      token: this.getJwtToken({id: user.id})
    }
  
  }
}