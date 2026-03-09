import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Item extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  reference: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  quantity: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 5, // Seuil par défaut
  })
  lowStockAlert: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isP2: boolean;
}
