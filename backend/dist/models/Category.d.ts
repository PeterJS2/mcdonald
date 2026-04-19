import { Model } from 'sequelize-typescript';
import { Product } from './Product';
export declare class Category extends Model {
    id: string;
    name: string;
    products: Product[];
}
//# sourceMappingURL=Category.d.ts.map