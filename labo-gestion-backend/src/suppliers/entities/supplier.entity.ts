import { Column, Model, Table, HasMany } from 'sequelize-typescript';
import { Item } from '../../item/entities/item.entity';
@Table
export class Supplier extends Model {
  @Column
  name: string;

  @Column
  contact: string;

  @Column
  email: string;

  // un fournisseur est lié à plusieurs articles
  @HasMany(() => Item)
  items: Item[];
}
