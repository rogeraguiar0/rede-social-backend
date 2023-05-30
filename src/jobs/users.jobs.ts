import { PrismaClient } from "@prisma/client";
import Bull, { Queue } from "bull";
import { redis } from "src/redis/redis.service";

const prisma = new PrismaClient();

class UsersJobs {
  private usersQueue: Queue;

  constructor() {
    this.usersQueue = new Bull("users");

    this.usersQueue.process("allUsers", async (job) => {
      await redis.set("getAllUsers", job.data);
      await redis.set("getAllUsers:validation", "chuchu", "EX", 15);
    });
  }

  async setAllUsersProducer() {
    const users = await prisma.user.findMany();

    console.log("está na fila");
    await this.usersQueue.add("allUsers", JSON.stringify(users));
  }
}

export { UsersJobs };
