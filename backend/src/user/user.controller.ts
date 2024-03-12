import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Image, Product, Profile, User } from '@prisma/client';
import { signInDto, signUpDto } from './dto/sign.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { GetUser } from './get-user.decorator';
import { ProfileDto } from './dto/profile.dto';
import AddProductDto from './dto/addProduct.dto';
import { UserProfileDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard())
  @Get()
  async emailUser(@GetUser() user: User) {
    return this.userService.emailUser(user.email);
  }

  @Get('/all')
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @UseGuards(AuthGuard())
  @Get('/verify')
  async verifyToken(@Req() req: Request, @Res() res: Response) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split(' ')[1];
      const currentUser = await this.userService.checkingToken(
        token,
        'Secret1234',
      );

      return res.json({ user: currentUser }); // Sending response using res object
    } catch (error) {
      console.log('Error', error);
    }
  }

  @Post('/signup')
  async signUp(@Body() data: signUpDto): Promise<User> {
    return this.userService.signUp(data);
  }

  @Post('/signin')
  async signIn(
    @Body() signInDto: signInDto,
  ): Promise<{ access_token: string }> {
    return this.userService.signIn(signInDto);
  }

  @Delete('/del-user/:id')
  async deleteUser(@Param('id') id: number): Promise<User> {
    return this.userService.deleteUser(id);
  }

  @Delete('/del-all-user')
  async deleteAllUsers() {
    return this.userService.deleteAllUsers();
  }

  @UseGuards(AuthGuard())
  @Get('/my-profile')
  async getProfile(@GetUser() user: User) {
    return this.userService.getProfile(user);
  }

  @Get('/my-profile/all')
  async getAllProfile(): Promise<Profile[]> {
    return this.userService.getAllProfile();
  }

  @UseGuards(AuthGuard())
  @Post('/my-profile/nickname')
  async updateNickname(
    @GetUser() user: User,
    @Body('nickname') nickname: string,
  ): Promise<User> {
    return this.userService.updateNickname(user, nickname);
  }

  @UseGuards(AuthGuard())
  @Post('/my-profile/update')
  async updateProfile(@GetUser() user: User, @Body() data: UserProfileDto) {
    const result = await this.userService.updateProfile(user, data);
    return result;
  }

  @Post('/my-profile/upload')
  @UseGuards(AuthGuard())
  async uploadImage(
    @Req() req: Request,
    @Res() res: Response,
    @GetUser() user: User,
  ) {
    const { imageUrl, image_size } = req.body;
    const result = await this.userService.uploadProfileImage(
      user,
      imageUrl,
      Number(image_size),
    );
    return res.status(200).json({ user: result });
  }

  @Delete('/my-profile/:id')
  async deleteProfile(@Param('id') id: number): Promise<Profile> {
    return this.userService.deleteProfile(Number(id));
  }

  @UseGuards(AuthGuard())
  @Post('/my-store/add-product')
  async addProduct(
    @GetUser() user: User,
    @Body() addProductDto: AddProductDto,
  ) {
    return this.userService.addProduct(user, addProductDto);
  }

  @UseGuards(AuthGuard())
  @Post('/my-store/update-product/:id')
  async updateProduct(
    @GetUser() user: User,
    @Param('id') id: number,
    @Body() updateProduct: AddProductDto,
  ): Promise<User> {
    return this.userService.updateProduct(user, id, updateProduct);
  }

  @UseGuards(AuthGuard())
  @Post('/my-store')
  async getProductsWhileUpdate(@Body('checklist') checklist: string) {
    const converted_checklist = checklist
      .split(',')
      .map((val) => parseInt(val));
    return this.userService.getProductsWhileUpdate(converted_checklist);
  }

  @UseGuards(AuthGuard())
  @Post('/my-store/delete-product')
  async deleteProduct(
    @GetUser() user: User,
    @Body('checklist') list: number[],
  ) {
    return this.userService.deleteProduct(user, list);
  }
}
