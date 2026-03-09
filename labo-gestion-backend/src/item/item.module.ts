import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { Item } from './entities/item.entity';

@Module({
  imports: [SequelizeModule.forFeature([Item])],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [SequelizeModule],
})
export class ItemModule {}
