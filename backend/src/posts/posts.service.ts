import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  private posts: Post[] = [
    { id: 1, userId: 1, title: 'Post 1', body: 'First post' },
    { id: 2, userId: 2, title: 'Post 2', body: 'Second post' },
  ];
  private nextId = 3;

  findAll(): Post[] {
    return this.posts;
  }

  findOne(id: number): Post {
    const p = this.posts.find(x => x.id === id);
    if (!p) throw new NotFoundException('Post not found');
    return p;
  }

  create(dto: CreatePostDto): Post {
    const created: Post = { id: this.nextId++,userId: dto.userId, title: dto.title, body: dto.body };
    this.posts.unshift(created); 
    return created;
  }

  update(id: number, dto: UpdatePostDto): Post {
    const p = this.findOne(id);
    Object.assign(p, dto);
    return p;
  }

  remove(id: number): void {
    const before = this.posts.length;
    this.posts = this.posts.filter(x => x.id !== id);
    if (this.posts.length === before) throw new NotFoundException('Post not found');
  }

  createForUser(userId: number, dto: Omit<CreatePostDto, 'userId'>): Post {
    const created: Post = { id: this.nextId++, userId, title: dto.title, body: dto.body };
    this.posts.unshift(created);
    return created;
  }

  findByUser(userId: number): Post[] {
    return this.posts.filter(p => p.userId === userId);
  }
}
