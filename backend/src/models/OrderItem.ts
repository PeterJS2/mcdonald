import { Table, Column, Model, DataType, ForeignKey, BelongsTo, IsUUID, PrimaryKey, Default } from 'sequelize-typescript';
import { Order } from './Order';
import { Product } from './Product';

@Table({
  tableName: 'order_items',
  timestamps: false,
})
export class OrderItem extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => Order)
  @Column(DataType.UUID)
  order_id!: string;

  @BelongsTo(() => Order)
  order!: Order;

  @ForeignKey(() => Product)
  @Column(DataType.UUID)
  product_id!: string;

  @BelongsTo(() => Product)
  product!: Product;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price!: number;
}
