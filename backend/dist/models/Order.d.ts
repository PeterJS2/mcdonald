import { Model } from 'sequelize-typescript';
import { OrderItem } from './OrderItem';
export declare class Order extends Model {
    id: string;
    total_price: number;
    status: 'pending' | 'completed' | 'cancelled';
    items: OrderItem[];
}
//# sourceMappingURL=Order.d.ts.map