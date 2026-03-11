import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table
export class User extends Model {
  @Column({ unique: true, allowNull: false })
  declare username: string; // Utilisez 'declare'

  @Column({ allowNull: false })
  declare password: string; // Utilisez 'declare'

  @Column({
    type: DataType.ENUM('admin', 'user'),
    defaultValue: 'user',
  })
  declare role: string; // Utilisez 'declare'
}
