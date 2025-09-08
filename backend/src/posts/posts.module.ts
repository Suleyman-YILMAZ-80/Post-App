import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService], // başka modüller de isterse kullanabilsin (opsiyonel)
})
export class PostsModule {}
