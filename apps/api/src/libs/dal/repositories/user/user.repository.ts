import { BaseRespository } from '../base-respository';
import { UserDBModel, UserEntity } from './user.entity';
import { User } from './user.schema';

export class UserRepository extends BaseRespository<
  UserDBModel,
  UserEntity,
  object
> {
  constructor() {
    super(User, UserEntity);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.findOne({
      email,
    });
  }

  async findById(id: string, select?: string): Promise<UserEntity | null> {
    const data = await this.MongooseModel.findById(id, select);
    if (!data) return null;

    return this.mapEntity(data);
  }
  async userExists(userId: string) {
    return await this.findOne(
      {
        _id: userId,
      },
      'id',
    );
  }
}
