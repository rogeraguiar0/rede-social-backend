import { Module } from "@nestjs/common";
import { UserModule } from "./modules/user/user.module";
import { PostModule } from "./modules/post/post.module";
import { AuthModule } from "./modules/auth/auth.module";
import { FollowingModule } from "./modules/following/following.module";
import { CommentModule } from "./modules/comment/comment.module";
import { BullModule } from "@nestjs/bull";

@Module({
  imports: [
    UserModule,
    PostModule,
    AuthModule,
    FollowingModule,
    CommentModule,
    BullModule.forRoot({
      redis: {
        host: "localhost",
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: "getAllUsers",
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
