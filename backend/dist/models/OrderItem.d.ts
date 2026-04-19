import { Model } from 'sequelize-typescript';
import { Order } from './Order';
import { Product } from './Product';
export declare class OrderItem extends Model {
    id: string;
    order_id: string;
    order: Order;
    product_id: string;
    product: Product;
    quantity: number;
    price: number;
}
//# sourceMappingURL=OrderItem.d.ts.map