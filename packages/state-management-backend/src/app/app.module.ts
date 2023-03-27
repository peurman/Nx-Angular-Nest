import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './database/services/prisma.service';
import { AuthModule } from './auth/auth.module';
import { getEnvPath } from './common/utils/env-path';
import { validate } from './common/utils/env-validate';
import { DBModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { BusinessModule } from './business/business.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ReflectMetadataProvider } from '@mikro-orm/core';
import { Business_HQ } from './business/entities/business.entity';
import { Business_classification } from './business/entities/business_classification.entity';
import { ReviewsModule } from './reviews/reviews.module';

const envFilePath = getEnvPath(process.env.WORKDIR);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      validate,
      isGlobal: true,
    }),
    UsersModule,
    ProductsModule,
    AuthModule,
    BusinessModule,
    DBModule,
    MikroOrmModule.forRoot(),
    ReviewsModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
