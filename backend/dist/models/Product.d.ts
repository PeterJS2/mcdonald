import { Model } from 'sequelize-typescript';
import { Category } from './Category';
export declare class Product extends Model {
    id: string;
    name: string;
    price: number;
    image_url?: string;
    category_id: string;
    category: Category;
}
//# sourceMappingURL=Product.d.ts.map