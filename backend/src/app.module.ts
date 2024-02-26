import {Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { StoreModule } from './store/store.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { StoreuserModule } from './storeuser/storeuser.module';
import { ImageModule } from './image/image.module';
import { OrderproductModule } from './orderproduct/orderproduct.module';
import { EventsModule } from './events/events.module';
import { ProductImageModule } from './product-image/product-image.module';

@Module({
  imports: [UserModule,ServeStaticModule.forRoot({
    rootPath: join(__dirname,"..",'profile_images')
  }), StoreModule, OrderModule, ProductModule, StoreuserModule, ImageModule, OrderproductModule, EventsModule, ProductImageModule],
})
export class AppModule{}
