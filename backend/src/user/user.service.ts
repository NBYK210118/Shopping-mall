import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Product, Profile, User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { signInDto, signUpDto } from './dto/sign.dto';
import { UserProfileDto } from './dto/user.dto';
import ProductDetailDto from './dto/addProduct.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // 토큰 유효성 검증
  async verifyToken(token: string, secretKey: string) {
    try {
      const decodedToken = await this.jwtService.verify(token, {
        secret: secretKey,
      });
      return decodedToken;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // 토큰 기한이 만료되었는지
  async isTokenExpired(token: string) {
    const decodedToken = await this.jwtService.decode(token);
    const expirationTime = new Date(decodedToken.exp * 1000);
    const currentTime = new Date();

    return expirationTime < currentTime;
  }

  // 이메일로 유저 정보 가져오기
  async emailUser(email: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { email },
      include: {
        sellinglist: {
          include: {
            products: {
              select: {
                id: true,
                category_name: true,
                status: true,
                price: true,
                name: true,
                images: true,
                manufacturer: true,
                description: true,
                isDiscounting: true,
                discountPrice: true,
                discountRatio: true,
              },
            },
            store: true,
          },
        },
        profile: true,
        orders: true,
        store: true,
        likedProducts: true,
        viewedProducts: true,
        wishlist: true,
        reviews: true,
      },
    });
    return user;
  }

  // 토큰값으로 유저 정보 가져오기
  async getTokenUser(token: string): Promise<User> {
    const decodedToken = await this.jwtService.verify(token, {
      secret: 'Secret1234',
    });
    if (!decodedToken) {
      throw new UnauthorizedException();
    }
    const user = await this.emailUser(decodedToken.email);

    return user;
  }

  // 토큰 최종 유효성 검증
  async checkingToken(token: string, secretKey: string) {
    try {
      // JWT 토큰을 검증하고 디코딩합니다
      const decodedToken = await this.verifyToken(token, 'Secret1234');
      // 토큰이 유효한 경우, 만료 여부를 확인합니다
      const isExpired = await this.isTokenExpired(token);
      const user = await this.getTokenUser(token);
      if (!isExpired) {
        return user;
      } else {
        throw new UnauthorizedException('만료됨');
      }
    } catch (error) {
      console.log('Error', error);
      throw new UnauthorizedException('검증 도중 에러 발생');
    }
  }

  // 회원가입
  async signUp(data: signUpDto): Promise<User> {
    const { email, password, firstName, lastName } = data;
    const hash = await bcrypt.hash(password, 10);
    const signup_result = await this.prisma.user.create({
      data: {
        email,
        password: hash,
        firstName,
        lastName,
        profile: {
          create: {},
        },
      },
      include: {
        reviews: true,
        orders: true,
        profile: true,
        store: true,
        wishlist: true,
      },
    });
    return signup_result;
  }

  // 로그인
  async signIn(signInDto: signInDto): Promise<{ access_token: string }> {
    const { email, password } = signInDto;
    const user = await this.emailUser(email);
    const isMatch = await bcrypt.compare(password, user.password);

    if (user && isMatch) {
      const payload = { email };
      const access_token = this.jwtService.sign(payload);
      return { access_token };
    } else {
      if (user.email !== email || !isMatch) {
        console.log('잘못된 계정이나 비밀번호');
      }
      throw new UnauthorizedException('login failed');
    }
  }

  // 유저 생성 id 값으로 유저 정보 가져오기
  async getUser(id: number): Promise<User> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  // 모든 유저 정보 가져오기(관리자 권한)
  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  // 유저 정보 삭제하기(회원탈퇴)
  async deleteUser(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id: Number(id) } });
  }

  // 유저 정보 모두 삭제하기
  async deleteAllUsers() {
    return this.prisma.user.deleteMany();
  }

  // 닉네임 변경
  async updateNickname(user: User, nickname: string): Promise<User> {
    await this.prisma.profile.update({
      where: { userId: user.id },
      data: { nickname },
    });
    const userinfo = await this.emailUser(user.email);

    return userinfo;
  }

  // 프로필 정보 수정
  async updateProfile(user: User, data: UserProfileDto) {
    const { firstName, lastName, email, address, store, phoneNumber } = data;

    const alreadyExistStore = await this.prisma.store.findUnique({
      where: { name: store },
    });

    if (user.storeId === null) {
      if (alreadyExistStore) {
        await this.prisma.store.update({
          where: { id: alreadyExistStore.id },
          data: { users: { connect: { id: user.id } } },
        });
        await this.prisma.user.update({
          where: { id: user.id },
          data: { store: { connect: { id: alreadyExistStore.id } } },
        });
      } else {
        const create_new_store = await this.prisma.store.create({
          data: { name: store, users: { connect: { id: user.id } } },
        });
        await this.prisma.user.update({
          where: { id: user.id },
          data: { store: { connect: { id: create_new_store.id } } },
        });
      }
    } else {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { store: { disconnect: { id: user.storeId } } },
      });
      if (alreadyExistStore) {
        const new_store = await this.prisma.store.update({
          where: { id: alreadyExistStore.id },
          data: { users: { connect: { id: user.id } } },
        });
        await this.prisma.user.update({
          where: { id: user.id },
          data: { store: { connect: { id: new_store.id } } },
        });
      } else {
        const create_new_store = await this.prisma.store.create({
          data: { users: { connect: { id: user.id } }, name: store },
        });
        await this.prisma.user.update({
          where: { id: user.id },
          data: { store: { connect: { id: create_new_store.id } } },
        });
      }
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { firstName, lastName, email },
    });
    await this.prisma.profile.update({
      where: { userId: user.id },
      data: { address, phoneNumber },
    });

    const result = await this.emailUser(user.email);

    return result;
  }

  // 프로필 이미지 업로드
  async uploadProfileImage(user: User, imgUrl: string, img_size: number) {
    const image = await this.prisma.image.create({
      data: { imgUrl, size: img_size },
    });
    await this.prisma.profile.update({
      where: { userId: user.id },
      data: { imageUrl: imgUrl, imageId: image.id },
    });

    const result = await this.emailUser(user.email);

    return result;
  }

  // 프로필 가져오기
  async getProfile(user: User): Promise<Profile> {
    return this.prisma.profile.findUnique({ where: { userId: user.id } });
  }

  // 모든 프로필 정보 가져오기
  async getAllProfile(): Promise<Profile[]> {
    return this.prisma.profile.findMany();
  }

  // 프로필 삭제하기
  async deleteProfile(id: number): Promise<Profile> {
    return this.prisma.profile.delete({ where: { id: id } });
  }

  // 판매 상품 등록하기
  async addProduct(user: User, productDetailDto: ProductDetailDto) {
    const {
      image,
      image_size,
      name,
      detail,
      price,
      manufacturer,
      category,
      inventory,
      status,
      seller,
      discountPrice,
      discountRatio,
      isDiscounting,
    } = productDetailDto;
    const detail2 = detail.trim();
    const priceWithoutComma = price.replace(/,/g, '');
    const parsedIntPrice = parseInt(priceWithoutComma, 10);
    const parsedDiscountPrice = parseInt(discountPrice.replace(/,/g, ''));
    let product_category = null;
    let onsales = null;

    const finding_category = await this.prisma.category.findFirst({
      where: { name: category },
    });

    if (!finding_category) {
      product_category = await this.prisma.category.create({
        data: { name: category },
      });
    } else {
      product_category = finding_category;
    }

    const product_image = await this.prisma.image.create({
      data: { imgUrl: image, size: Number(image_size) },
    });

    const product = await this.prisma.product.create({
      data: {
        name,
        description: detail2,
        price: Number(parsedIntPrice),
        manufacturer,
        status,
        seller,
        discountPrice: parsedDiscountPrice,
        isDiscounting: Boolean(isDiscounting),
        discountRatio: Number(discountRatio),
        category_name: category,
        inventory: Number(inventory),
        category: { connect: { id: product_category.id } },
        images: { connect: { id: product_image.id } },
      },
    });

    await this.prisma.productImage.create({
      data: { imageId: product_image.id, productId: product.id },
    });

    try {
      if (!user.sellinglistId) {
        if (!user.storeId) {
          onsales = await this.prisma.sellingList.create({
            data: {
              products: { connect: { id: product.id } },
              user: { connect: { id: user.id } },
            },
          });
        } else {
          onsales = await this.prisma.sellingList.create({
            data: {
              products: { connect: { id: product.id } },
              user: { connect: { id: user.id } },
              store: { connect: { id: user.storeId } },
            },
          });
        }
      } else {
        onsales = await this.prisma.sellingList.update({
          where: { userId: user.id },
          data: {
            storeId: user.storeId,
            userId: user.id,
            products: { connect: { id: product.id } },
          },
        });
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: { sellinglistId: onsales.id },
      });
    } catch (error) {
      console.log('sellingList 레코드 생성 실패', error);
    }

    const onUser = await this.emailUser(user.email);
    return onUser;
  }

  // 판매 중인 물품 정보 수정하기
  async updateProduct(
    user: User,
    id: number,
    updateProductDto: ProductDetailDto,
  ): Promise<User> {
    const {
      name,
      price,
      detail,
      category,
      image,
      image_size,
      inventory,
      manufacturer,
      status,
      isDiscounting,
      discountPrice,
      discountRatio,
    } = updateProductDto;
    const priceWithoutComma = price.replace(/,/g, '');
    const parsedDiscountPrice = parseInt(discountPrice.replace(/,/g, ''));
    const parsedIntPrice = parseInt(priceWithoutComma, 10);
    const product_image = await this.prisma.productImage.findFirst({
      where: { productId: Number(id) },
    });

    await this.prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        price: parsedIntPrice,
        status,
        description: detail,
        category_name: category,
        inventory: Number(inventory),
        manufacturer,
        discountPrice: parsedDiscountPrice,
        discountRatio: Number(discountRatio),
        isDiscounting: Boolean(isDiscounting),
        images: {
          update: {
            where: { id: product_image.imageId },
            data: { imgUrl: image, size: Number(image_size) },
          },
        },
      },
    });

    const onUser = await this.emailUser(user.email);
    return onUser;
  }

  // 업데이트 버튼 클릭 시 체크된 상품 정보들에 대한 레코드 불러오기
  async getProductsWhileUpdate(checklist: number[]): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: { id: { in: checklist } },
      include: { images: true },
    });

    return products;
  }

  // 선택된 상품 제거하기(판매 취소 버튼)
  async deleteProduct(user: User, checklist: string) {
    const parsedChecklist = checklist.split(',').map((val) => parseInt(val));

    if (parsedChecklist.length === 1) {
      const img = await this.prisma.image.findFirst({
        where: { products: { some: { id: parsedChecklist[0] } } },
      });
      await this.prisma.productImage.delete({
        where: {
          productId_imageId: { productId: parsedChecklist[0], imageId: img.id },
        },
      });
      await this.prisma.image.delete({ where: { id: img.id } });
      await this.prisma.product.delete({
        where: { id: parsedChecklist[0] },
      });
    } else if (parsedChecklist.length > 1) {
      for (const id of parsedChecklist) {
        let img = await this.prisma.image.findFirst({
          where: { products: { some: { id } } },
        });
        await this.prisma.productImage.delete({
          where: {
            productId_imageId: {
              productId: id,
              imageId: img.id,
            },
          },
        });
        await this.prisma.image.delete({ where: { id: img.id } });
        await this.prisma.product.delete({
          where: { id },
        });
      }
    }

    const onUser = await this.emailUser(user.email);
    return onUser;
  }
}
