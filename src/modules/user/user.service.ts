import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserRepository } from "./repositories/user.repositorie";

@Injectable()
export class UserService {
  constructor(private usersRepository: UserRepository){}

  async create(createUserDto: CreateUserDto) {
    const findEmail = await this.usersRepository.findEmail(createUserDto.email);
    const findUsername = await this.usersRepository.findUsername(createUserDto.username);

    if(findEmail){
      throw new ConflictException("Email já existe");
    }

    if(findUsername){
      throw new ConflictException("Username já existe");
    }

    const user = await this.usersRepository.create(createUserDto);

    return user;
  }

  async findAll() {
    return await this.usersRepository.findAll();
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne(id);

    if(!user) {
      throw new NotFoundException("Usuário não encontrado");
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const findEmail = await this.usersRepository.findEmail(updateUserDto.email);
    const findUsername = await this.usersRepository.findUsername(updateUserDto.username);
    let user = await this.usersRepository.findOne(id);

    if(findEmail){
      throw new ConflictException("Email já existe");
    }

    if(findUsername){
      throw new ConflictException("Username já existe");
    }

    user = await this.usersRepository.update(id, updateUserDto);

    return user;
  }

  async remove(id: string) {
    const findUser = await this.usersRepository.findOne(id);

    if(!findUser){
      throw new NotFoundException("Usuário não encontrado");
    }
    
    return this.usersRepository.remove(id);
  }
}