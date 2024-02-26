import { Injectable, UnauthorizedException, UploadedFile } from '@nestjs/common';
import { Image, Profile, User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { signInDto, signUpDto } from './dto/sign.dto';
import { UserProfileDto } from './dto/user.dto';
import AddProductDto from './dto/addProduct.dto';
import { Category } from 'src/product/product.model';

@Injectable()
export class UserService {
    constructor(private prisma:PrismaService, private jwtService:JwtService) {}

    async verifyToken(token:string,secretKey:string) {
        try{
            const decodedToken = await this.jwtService.verify(token,{secret:secretKey});    
            return decodedToken;
        }catch (error){
            throw new Error('Invalid token');
        }
    
    }

    async isTokenExpired(token:string) {
        const decodedToken = await this.jwtService.decode(token);
        const expirationTime = new Date(decodedToken.exp * 1000);
        const currentTime = new Date();
        
        return expirationTime < currentTime;
    }

    async emailUser(email:string):Promise<User> {
        const user = await this.prisma.user.findFirst({
            where:{email},
            include:{
                sellinglist:{include:{products:true,store:true,user:true}},
                profile:true,
                orders:true,
                store:true,
                StoreUser:true,
                wishlist:true,
                reviews:true,
            }
        })
        return user;
    }

    async getTokenUser(token:string) : Promise<User> {
        const decodedToken = await this.jwtService.verify(token,{secret:"Secret1234"});
        if(!decodedToken){
            throw new UnauthorizedException();
        }
        const user = await this.emailUser(decodedToken.email);

        return user;
    }

    async checkingToken(token:string, secretKey:string) {
        try{
            // JWT 토큰을 검증하고 디코딩합니다
            const decodedToken = await this.verifyToken(token, 'Secret1234');
            // 토큰이 유효한 경우, 만료 여부를 확인합니다
            const isExpired = await this.isTokenExpired(token);
            const user = await this.getTokenUser(token);
            if(!isExpired){
                return user;
            }else{
                throw new UnauthorizedException('만료됨');
            }
        }catch(error){
            console.log('Error',error);
            throw new UnauthorizedException('검증 도중 에러 발생')
        }
    }

    async signUp(data:signUpDto) : Promise<User> {
        const {email, password, firstName, lastName} = data;
        const hash = await bcrypt.hash(password, 10);
        const signup_result = await this.prisma.user.create({
            data:{email,password:hash,firstName,lastName,profile:{
            create:{},
        }}, 
        include:{
            reviews:true,
            orders:true,
            profile:true,
            store:true,
            wishlist:true,
            StoreUser:true
        }
        });
        return signup_result
    }

    async signIn(
        signInDto : signInDto
    ) : Promise<{access_token: string}> {
        const { email, password } = signInDto;
        const user = await this.emailUser(email);
        const isMatch = await bcrypt.compare(password, user.password);

        if(user && isMatch) {
            const payload = { email };
            const access_token = this.jwtService.sign(payload);
            return {access_token}
        } else{
            if(user.email !== email || !isMatch){
                console.log('잘못된 계정이나 비밀번호');
            }
            throw new UnauthorizedException('login failed');
        }
    }

    async getUser(id:number) : Promise<User> {
        return this.prisma.user.findUnique({
            where:{id}
        })
    }

    async getAllUsers() : Promise<User[]> {
        return this.prisma.user.findMany()
    }

    async deleteUser(id:number) : Promise<User> {
        return this.prisma.user.delete({where:{id:Number(id)}})
    }

    async deleteAllUsers() {
        return this.prisma.user.deleteMany()
    }

    async updateNickname(user:User, nickname:string) : Promise<User>{
        const updated_profile = await this.prisma.profile.update({
            where:{userId:user.id},
            data:{nickname},
        })
        const userinfo = await this.emailUser(user.email);

        return userinfo
    }
    
    async updateProfile(user:User, data: UserProfileDto){
        const {firstName,lastName,email,address,store} = data;

        const user_info = await this.emailUser(user.email);
        console.log('user info',user_info);
        if(user_info["store"] === null ){
            const store_data = await this.prisma.store.create({
                data:{name:store, User:{connect:{id:user_info.id}}}
            })
            console.log('store_data',store_data);
            await this.prisma.storeUser.create({
                data:{storeId:store_data.id, userId:user_info.id}
            })
        }else{
            const store_name = user_info["store"]["name"];
            
            const updated_store = await this.prisma.store.update({
                where:{name:store_name},
                data:{name:store}
            })
            
            const storeuser = await this.prisma.storeUser.findFirst({
                where:{userId:user_info.id}
            })
            await this.prisma.storeUser.update({
                where:{id:storeuser.id},
                data:{storeId:updated_store.id}
            })
        }

        await this.prisma.user.update({
            where:{id:user.id},
            data:{firstName,lastName,email}
        })
        await this.prisma.profile.update({
            where:{userId:user.id},
            data:{address}
        })
        
        const result = await this.emailUser(user.email);

        return result
    }

    async uploadProfileImage(user:User,imgUrl:string, img_size:number){
        const image = await this.prisma.image.create({
            data:{imgUrl,size:img_size}
        })
        await this.prisma.profile.update({
            where:{userId:user.id},
            data:{imageUrl:imgUrl,imageId:image.id}
        })

        const result = await this.emailUser(user.email);

        return result;
    }

    async getProfile(user:User) : Promise<Profile> {
        return this.prisma.profile.findUnique({where:{userId:user.id}})
    }

    async getAllProfile() : Promise<Profile[]> {
        return this.prisma.profile.findMany();
    }

    async deleteProfile(id:number) : Promise<Profile> {
        return this.prisma.profile.delete({where:{id:id}})
    }

    async addProduct(user:User, addProductDto:AddProductDto) {
        const {image, image_size, name, detail, price, manufacturer,category,inventory,status} = addProductDto;
        const detail2 = detail.trim();
        const priceWithoutComma = price.replace(/,/g,'');
        const parsedIntPrice = parseInt(priceWithoutComma,10);
        let product_category = null;
        let onsales = null;

        const finding_category = await this.prisma.category.findFirst({
            where:{name:category}
        })

        if(!finding_category){
            product_category = await this.prisma.category.create({
                data:{name:category}
            })   
        }else{
            product_category=finding_category
        }

        const product_image = await this.prisma.image.create({
            data:{imgUrl:image, size:Number(image_size)}
        })

        const product = await this.prisma.product.create({
            data:{
                name,
                description:detail2,
                price:Number(parsedIntPrice),
                manufacturer,
                status,
                category_name:category,
                inventory:Number(inventory),
                category:{connect:{id:product_category.id}},
                images:{connect:{id:product_image.id}}
            }
        })

        await this.prisma.productImage.create({
            data:{imageId:product_image.id, productId:product.id}
        });

        try{
            if(!user.sellinglistId){
                onsales = await this.prisma.sellingList.create({
                    data:{storeId:user.storeId,userId:user.id, products:{connect:{id:product.id}}}
                })
            }else{
                onsales = await this.prisma.sellingList.update({
                    where:{userId:user.id},
                    data:{storeId:user.storeId,userId:user.id,products:{connect:{id:product.id}}}
                })
            }
            await this.prisma.store.update({
                where:{id:user.storeId},
                data:{sellingListId:onsales.id}
            })
            await this.prisma.user.update({
                where:{id:user.id},
                data:{sellinglistId:onsales.id}
            })
        }catch(error){
            console.log('sellingList 레코드 생성 실패',error);
        }

        const onUser = await this.emailUser(user.email);
        return onUser
    }    
}
