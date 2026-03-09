import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Item } from './entities/item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemService {
  private readonly logger = new Logger(ItemService.name);

  // Injection du modèle de la base de données
  constructor(
    @InjectModel(Item)
    private itemModel: typeof Item,
  ) {}

  // --- CRUD ---
  async create(createItemDto: CreateItemDto): Promise<Item> {
    return this.itemModel.create({ ...createItemDto });
  }

  async findAll(): Promise<Item[]> {
    return this.itemModel.findAll({ order: [['name', 'ASC']] });
  }

  async findOne(id: number): Promise<Item> {
    const item = await this.itemModel.findByPk(id);
    if (!item) {
      throw new NotFoundException(`Consommable avec l'ID #${id} introuvable.`);
    }
    return item;
  }

  async update(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
    const item = await this.findOne(id);
    return item.update({ ...updateItemDto });
  }

  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    await item.destroy();
  }

  // --- LOGIQUE MÉTIER LABO STOCK ALERT ---
  async decrementStock(id: number, amount: number): Promise<Item> {
    const item = await this.findOne(id);
    item.quantity -= amount;
    await item.save();

    if (item.quantity <= item.lowStockAlert) {
      this.logger.warn(
        `ALERTE : Stock critique pour [${item.name}]. Quantité restante : ${item.quantity}.`,
      );
    }
    return item;
  }
}
