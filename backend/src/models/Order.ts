import { Table, Column, Model, DataType, HasMany, IsUUID, PrimaryKey, Default } from 'sequelize-typescript';
import { OrderItem } from './OrderItem';

@Table({
  tableName: 'orders',
  timestamps: true,
})
export class Order extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  total_price!: number;

  @Column({
    type: DataType.ENUM('pending', 'completed', 'cancelled'),
    defaultValue: 'pending',
  })
  status!: 'pending' | 'completed' | 'cancelled';

  @HasMany(() => OrderItem)
  items!: OrderItem[];
}
