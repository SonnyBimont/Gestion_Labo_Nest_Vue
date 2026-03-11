import { Column, Model, Table, HasMany } from 'sequelize-typescript';
import { Item } from '../../item/entities/item.entity';
@Table
export class Supplier extends Model {
  @Column
  declare name: string;

  @Column
  declare contact: string;

  @Column
  declare email: string;

  // un fournisseur est lié à plusieurs articles
  @HasMany(() => Item)
  declare items: Item[];
}
