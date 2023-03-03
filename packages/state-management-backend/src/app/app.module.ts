import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getEnvPath } from './common/utils/env-path';
import { validate } from './common/utils/env-validate';
import { DBModule } from './database/database.module';
import { DBConfigService } from './database/database-config.service';
import { UsersModule } from './users/users.module';

const envFilePath = getEnvPath(process.env.WORKDIR);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      validate,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [DBModule],
      useExisting: DBConfigService,
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
