import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  // Demo veriler (RAM'de durur, server kapanınca sıfırlanır)
  private users: User[] = [
    { id: 1, name: 'Leanne Graham', username: 'Bret', email: 'leanne@example.com' },
    { id: 2, name: 'Ervin Howell', username: 'Antonette', email: 'ervin@example.com' },
  ];
  private nextId = 3; // yeni kullanıcılara verilecek id

  // LIST
  findAll(): User[] {
    return this.users;
  }

  // READ
  findOne(id: number): User {
    const u = this.users.find(x => x.id === id);
    if (!u) throw new NotFoundException('User not found');
    return u;
  }

  // CREATE
  create(dto: CreateUserDto): User {
    const created: User = { id: this.nextId++, ...dto };
    this.users.push(created);
    return created;
  }

  // UPDATE (kısmi güncelleme)
  update(id: number, dto: UpdateUserDto): User {
    const u = this.findOne(id);     // yoksa 404 fırlatır
    Object.assign(u, dto);          // sadece gelen alanları günceller
    return u;
  }

  // DELETE
  remove(id: number): void {
    const before = this.users.length;
    this.users = this.users.filter(x => x.id !== id);
    if (this.users.length === before) throw new NotFoundException('User not found');
  }
}
