import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Supplier } from './entities/supplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SupplierService {
  constructor(
    @InjectModel(Supplier)
    private supplierModel: typeof Supplier,
  ) {}

  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    return this.supplierModel.create({ ...createSupplierDto });
  }

  async findAll(): Promise<Supplier[]> {
    return this.supplierModel.findAll({ order: [['name', 'ASC']] });
  }

  async findOne(id: number): Promise<Supplier> {
    const supplier = await this.supplierModel.findByPk(id);
    if (!supplier) {
      throw new NotFoundException(`Fournisseur #${id} introuvable.`);
    }
    return supplier;
  }

  async update(id: number, updateSupplierDto: UpdateSupplierDto): Promise<Supplier> {
    const supplier = await this.findOne(id);
    return supplier.update({ ...updateSupplierDto });
  }

  async remove(id: number): Promise<void> {
    const supplier = await this.findOne(id);
    await supplier.destroy();
  }
}
