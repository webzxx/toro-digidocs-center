import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import NavigationMenu from "./NavigationMenu";

const Navbar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <NavigationMenu
      isAuthenticated={!!session?.user}
      userRole={session?.user?.role}
    />
  );
};

export default Navbar;
