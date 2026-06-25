import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import AddressesClient from '@/components/AddressesClient';

export default async function AddressesPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      defaultAddress: true,
      phone: true,
    },
  });

  return (
    <AddressesClient
      initialAddress={user?.defaultAddress || ''}
      initialPhone={user?.phone || ''}
    />
  );
}
