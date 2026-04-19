import { Table, Column, Model, DataType, ForeignKey, BelongsTo, IsUUID, PrimaryKey, Default } from 'sequelize-typescript';
import { Category } from './Category';

@Table({
  tableName: 'products',
  timestamps: true,
})
export class Product extends Model {
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

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price!: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  image_url?: string;

  @ForeignKey(() => Category)
  @Column(DataType.UUID)
  category_id!: string;

  @BelongsTo(() => Category)
  category!: Category;
}
