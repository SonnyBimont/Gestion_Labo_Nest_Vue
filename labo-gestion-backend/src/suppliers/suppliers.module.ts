import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SupplierService } from './suppliers.service';
import { SupplierController } from './suppliers.controller';
import { Supplier } from './entities/supplier.entity';
import { Item } from '../item/entities/item.entity';

@Module({
  // Autorise l'injection du modèle Supplier dans le Service
  imports: [SequelizeModule.forFeature([Supplier, Item])],
  controllers: [SupplierController],
  providers: [SupplierService],
})
export class SupplierModule {}
