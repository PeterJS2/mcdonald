import { Table, Column, Model, DataType, HasMany, IsUUID, PrimaryKey, Default, BeforeCreate } from 'sequelize-typescript';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model {
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
  username!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.ENUM('admin', 'kasir'),
    allowNull: false,
  })
  role!: 'admin' | 'kasir';

  @BeforeCreate
  static async hashPassword(user: User) {
    user.password = await bcrypt.hash(user.password, 10);
  }

  async validatePassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }
}
