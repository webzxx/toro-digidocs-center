import NavigationMenu from "./NavigationMenu";
import getSession from '@/lib/auth/getSession';

const Navbar = async () => {
  const session = await getSession();

  return (
    <NavigationMenu
      isAuthenticated={!!session?.user}
      userRole={session?.user?.role}
    />
  );
};

export default Navbar;
