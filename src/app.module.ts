import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ItemModule } from './item/item.module';
import { UserModule } from './user/user.module';
import { CartItemModule } from './cart-item/cartItem.module';

@Module({
  imports: [UserModule, ConfigModule.forRoot(), ItemModule, CartItemModule],
  providers: [],
  exports: [],
})
export class AppModule {}
