import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
  // loop for 10 times
  const users = [];
  for (let i = 0; i < 10; i++) {
    const user = {
      username: faker.internet.userName(),
      avatarUrl: faker.image.avatar(),
      displayName: faker.person.firstName(),
      bio: faker.lorem.paragraph(),
      location: faker.location.city(),
      email: faker.internet.email(),
    };

    // eslint-disable-next-line no-await-in-loop
    const dbUser = await prisma.user.create({
      data: user,
    });

    users.push(dbUser);
  }

  for (let i = 0; i < 100; i++) {
    const randomUserIndex = faker.number.int({
      min: 0,
      max: users.length - 1,
    });

    const randomWorldCount = faker.number.int({
      min: 5,
      max: 12,
    });
    const tweet = {
      content: faker.lorem.sentence(randomWorldCount),
      userId: users[randomUserIndex].id,
    };

    // eslint-disable-next-line no-await-in-loop
    await prisma.tweet.create({
      data: tweet,
    });
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })

  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
