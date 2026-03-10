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
  name: string;

  // 1. Référence interne (Traçabilité labo)
  @Column({ unique: true })
  internalRef: string;

  // 2. Référence externe (Commandes)
  @Column
  supplierRef: string;

  // 3. Prix unitaire (FLOAT pour les décimales)
  @Column({ type: DataType.FLOAT, allowNull: true })
  price: number;

  @Column
  quantity: number;

  @Column({ defaultValue: 5 })
  lowStockThreshold: number;

  @Column({ defaultValue: false })
  isP2: boolean;

  // --- RELATION AVEC LE FOURNISSEUR ---
  // Colonne "supplierId"
  @ForeignKey(() => Supplier)
  @Column
  supplierId: number;

  // Indique à l'ORM comment charger les données du fournisseur
  @BelongsTo(() => Supplier)
  supplier: Supplier;
}
