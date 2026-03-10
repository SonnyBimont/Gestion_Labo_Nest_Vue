import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize/dist/sequelize.module';
import { ItemModule } from './item/item.module';
import { SupplierModule } from './suppliers/suppliers.module';
import { Item } from './item/entities/item.entity';
import { Supplier } from './suppliers/entities/supplier.entity';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'gestion_labo',
      models: [Item, Supplier],
      autoLoadModels: true,
      synchronize: true,
      sync: { alter: true },
    }),
    ItemModule,
    SupplierModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
