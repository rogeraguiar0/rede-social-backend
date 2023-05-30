import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserRepository } from "./repositories/user.repositorie";
import { redis } from "src/redis/redis.service";
import { UsersJobs } from "src/jobs/users.jobs";

@Injectable()
export class UserService {
  constructor(private usersRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.create(createUserDto);

    return user;
  }

  async findAll() {
    const usersJobs = new UsersJobs();
    const usersFromCache = await redis.get("getAllUsers");
    const isUsersFromCacheStale = !(await redis.get("getAllUsers:validation"));

    if (isUsersFromCacheStale) {
      console.log("is stale");
      await usersJobs.setAllUsersProducer();
    }

    if (usersFromCache) {
      return JSON.parse(usersFromCache);
    }

    const users = await this.usersRepository.findAll();

    await redis.set("getAllUsers", JSON.stringify(users));

    return users;
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne(id);

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updateUser = await this.usersRepository.update(id, updateUserDto);

    return updateUser;
  }

  async remove(id: string) {
    return this.usersRepository.remove(id);
  }

  async findEmail(email: string) {
    const user = await this.usersRepository.findEmail(email);

    return user;
  }
}
