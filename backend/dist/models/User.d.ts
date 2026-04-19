import { Model } from 'sequelize-typescript';
export declare class User extends Model {
    id: string;
    username: string;
    password: string;
    role: 'admin' | 'kasir';
    static hashPassword(user: User): Promise<void>;
    validatePassword(password: string): Promise<boolean>;
}
//# sourceMappingURL=User.d.ts.map