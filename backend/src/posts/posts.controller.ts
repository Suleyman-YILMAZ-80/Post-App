import { Controller, Get, Post as HttpPost, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller()
export class PostsController {
  constructor(private readonly posts: PostsService) {}

  @Get('posts') findAll() { return this.posts.findAll(); }

  @Get('posts/:id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.posts.findOne(id); }

  @HttpPost('posts')
  create(@Body() dto: CreatePostDto) { return this.posts.create(dto); }

  @Put('posts/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePostDto) {
    return this.posts.update(id, dto);
  }

  @Delete('posts/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    this.posts.remove(id); return { ok: true };
  }

  @HttpPost('users/:id/posts')
  createForUser(@Param('id', ParseIntPipe) id: number, @Body() dto: Omit<CreatePostDto, 'userId'>) {
    return this.posts.createForUser(id, dto);
  }

  @Get('users/:id/posts')
  findByUser(@Param('id', ParseIntPipe) id: number) {
    return this.posts.findByUser(id);
  }
}
