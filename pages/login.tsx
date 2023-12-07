import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
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
    login(email)
      .then(() => {
        void router.push('/');
      })
      .catch(() => {
        toast('Email not found');
      });
  };

  return (
    <div>
      <form
        onClick={handleSubmit}
        className="my-4 flex flex-col items-center gap-2"
      >
        <h2>Login with your email</h2>
        <input
          name="email"
          type="text"
          className="w-full border border-blue-300 bg-transparent p-2"
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
