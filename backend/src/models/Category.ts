import { Table, Column, Model, DataType, HasMany, IsUUID, PrimaryKey, Default } from 'sequelize-typescript';
import { Product } from './Product';

@Table({
  tableName: 'categories',
  timestamps: true,
})
export class Category extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name!: string;

  @HasMany(() => Product)
  products!: Product[];
}
