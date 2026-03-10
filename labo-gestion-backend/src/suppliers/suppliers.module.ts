import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SupplierService } from './suppliers.service';
import { SupplierController } from './suppliers.controller';
import { Supplier } from './entities/supplier.entity';

@Module({
  // Autorise l'injection du modèle Supplier dans le Service
  imports: [SequelizeModule.forFeature([Supplier])],
  controllers: [SupplierController],
  providers: [SupplierService],
})
export class SupplierModule {}
