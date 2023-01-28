import { useRouter } from 'next/router';
import { prisma } from '~/db/prisma';
import { useUser } from '../src/hooks/UserProvider';

export default function Login({ emails }: { emails: { email: string }[] }) {
  const { login } = useUser();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDatas = new FormData(e.currentTarget);
    const email = formDatas.get('email') as string;
    if (!email) return;
    login(email).then(() => {
      router.push('/');
    });
  };

  return (
    <div>
      <form onClick={handleSubmit} className="flex flex-col gap-2 items-center my-4">
        <h2>Login with your email</h2>
        <input
          name="email"
          type="text"
          className="p-2 w-full bg-transparent border border-blue-300"
          placeholder="email"
        />
        <input type="submit" value="Login" />
      </form>
      <div>
        <p>Here is some emails</p>
        <ul className="list-disc">
          {emails.map(({ email }) => (
            <li key={email}>{email}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export const getServerSideProps = async () => {
  const emails = await prisma.user.findMany({
    select: {
      email: true,
    },
    take: 5,
  });

  return {
    props: {
      emails,
    },
  };
};
