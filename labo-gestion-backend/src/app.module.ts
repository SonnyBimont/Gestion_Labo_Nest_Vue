import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemModule } from './item/item.module';
import { SequelizeModule } from '@nestjs/sequelize/dist/sequelize.module';
import { Item } from './item/entities/item.entity';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'gestion_labo',
      models: [Item],
      autoLoadModels: true,
      synchronize: true,
    }),
    ItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
