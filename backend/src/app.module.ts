import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { StoreModule } from './store/store.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { ImageModule } from './image/image.module';
import { OrderproductModule } from './orderproduct/orderproduct.module';
import { ProductImageModule } from './product-image/product-image.module';
import { CategoryModule } from './category/category.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { ReviewModule } from './review/review.module';
import { ViewedproductModule } from './viewedproduct/viewedproduct.module';
import { LikeModule } from './like/like.module';
import { SellinglistModule } from './sellinglist/sellinglist.module';
import { ShoppingbasketModule } from './shoppingbasket/shoppingbasket.module';
import { QuestionModule } from './question/question.module';
import { AnswerModule } from './answer/answer.module';

@Module({
  imports: [
    UserModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'profile_images'),
    }),
    StoreModule,
    OrderModule,
    ProductModule,
    ImageModule,
    OrderproductModule,
    ProductImageModule,
    CategoryModule,
    WishlistModule,
    ReviewModule,
    ViewedproductModule,
    LikeModule,
    SellinglistModule,
    ShoppingbasketModule,
    QuestionModule,
    AnswerModule,
  ],
})
export class AppModule {}
