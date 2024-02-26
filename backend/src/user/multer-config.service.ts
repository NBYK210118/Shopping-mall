import {Injectable} from "@nestjs/common";
import {DiskStorageOptions, MulterOptionsFactory} from "./multer-options";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import * as multer from 'multer'; 
import * as fs from 'fs';
import { extname } from "path";

@Injectable()
export class MulterConfigService implements MulterOptionsFactory{
    createMulterOptions(): MulterOptions {
        const storage = multer.diskStorage({
            destination:function(req,file,cb) {
                console.log(fs.existsSync("../../profile_images"));
                if(fs.existsSync("../../profile_images")){
                    fs.mkdirSync("./profile_images", {recursive:true});
                }
                cb(null, "./profile_images");
            },
            filename:function(req,file,cb){
                const randomName = Array(32).fill(null).map(()=>(Math.round(Math.random()*16)).toString()).join('');
                cb(null, `${randomName}${extname(file.originalname)}`);
            },
        
        })
        return {storage}
    }
}