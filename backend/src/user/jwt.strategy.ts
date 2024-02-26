import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "./user.model";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        private prisma : PrismaService
    ){
        super({
            secretOrKey: 'Secret1234',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate(payload) {
        const { email } = payload;
        const user:User = await this.prisma.user.findFirst({where:{email}});

        if(!user){
            throw new UnauthorizedException();
        }

        return user;
    }
}