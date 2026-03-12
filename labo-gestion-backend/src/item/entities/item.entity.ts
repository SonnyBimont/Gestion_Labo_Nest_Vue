import {
  Column,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { Supplier } from '../../suppliers/entities/supplier.entity';

@Table
export class Item extends Model {
  @Column
  declare name: string;

  // 1. Référence interne (Traçabilité labo)
  @Column({ unique: true })
  declare internalRef: string;

  // 2. Référence externe (Commandes)
  @Column
  declare supplierRef: string;

  // 3. Prix unitaire (FLOAT pour les décimales)
  @Column({ type: DataType.FLOAT, allowNull: true })
  declare price: number;

  @Column({ type: DataType.INTEGER })
  declare quantity: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare stockMax: number | null;

  @Column({ type: DataType.INTEGER, defaultValue: 5 })
  declare lowStockThreshold: number;

  @Column({ defaultValue: false })
  declare isP2: boolean;

  // --- RELATION AVEC LE FOURNISSEUR ---
  // Colonne "supplierId"
  @ForeignKey(() => Supplier)
  @Column
  declare supplierId: number;

  // Indique à l'ORM comment charger les données du fournisseur
  @BelongsTo(() => Supplier)
  declare supplier: Supplier;
}
