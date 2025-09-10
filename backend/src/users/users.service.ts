import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

  private users: User[] = [
    { id: 1, name: 'Leanne Graham', username: 'Bret', email: 'leanne@example.com' },
    { id: 2, name: 'Ervin Howell', username: 'Antonette', email: 'ervin@example.com' },
  ];
  private nextId = 3; 

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User {
    const u = this.users.find(x => x.id === id);
    if (!u) throw new NotFoundException('User not found');
    return u;
  }

  create(dto: CreateUserDto): User {
    const created: User = { id: this.nextId++, ...dto };
    this.users.push(created);
    return created;
  }

  update(id: number, dto: UpdateUserDto): User {
    const u = this.findOne(id);
    Object.assign(u, dto);
    return u;
  }

  remove(id: number): void {
    const before = this.users.length;
    this.users = this.users.filter(x => x.id !== id);
    if (this.users.length === before) throw new NotFoundException('User not found');
  }
}
