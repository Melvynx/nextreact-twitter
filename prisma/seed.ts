import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
  // loop for 10 times
  const usersPromises = [];
  for (let i = 0; i < 10; i++) {
    const user = {
      username: faker.internet.userName(),
      avatarUrl: faker.image.avatar(),
      displayName: faker.name.firstName(),
      bio: faker.lorem.paragraph(),
      location: faker.address.city(),
      email: faker.internet.email(),
    };
    usersPromises.push(
      prisma.user.create({
        data: user,
      })
    );
  }

  const users = await Promise.all(usersPromises);

  // loop for 100 times
  const tweetsPromises = [];
  for (let i = 0; i < 100; i++) {
    const randomUserIndex = faker.datatype.number({
      min: 0,
      max: users.length - 1,
    });

    const randomWorldCount = faker.datatype.number({
      min: 5,
      max: 12,
    });
    const tweet = {
      content: faker.lorem.sentence(randomWorldCount),
      userId: users[randomUserIndex].id,
    };

    tweetsPromises.push(
      prisma.tweet.create({
        data: tweet,
      })
    );
  }

  await Promise.all(tweetsPromises);
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
