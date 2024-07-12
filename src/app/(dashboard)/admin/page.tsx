import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"

const page = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return <div>Access denied</div>;
  }

  return (
    <div className="flex min-h-screen container">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-2xl mb-4">Admin Menu</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <a href="#dashboard" className="text-lg hover:underline">Dashboard</a>
            </li>
            <li className="mb-2">
              <a href="#users" className="text-lg hover:underline">Users</a>
            </li>
            <li className="mb-2">
              <a href="#settings" className="text-lg hover:underline">Settings</a>
            </li>
            <li className="mb-2">
              <a href="#reports" className="text-lg hover:underline">Reports</a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 bg-gray-100">
        <h2 className="text-4xl mb-4">Admin page - welcome back {session.user.username}</h2>
        <section id="dashboard" className="mb-8">
          <h3 className="text-2xl mb-2">Dashboard</h3>
          <div className="bg-white p-4 rounded shadow">
            <p>Overview of site activity.</p>
            {/* Add more dashboard content here */}
          </div>
        </section>
        <section id="users" className="mb-8">
          <h3 className="text-2xl mb-2">Users</h3>
          <div className="bg-white p-4 rounded shadow">
            <p>Manage users.</p>
            {/* Add user management content here */}
          </div>
        </section>
        <section id="settings" className="mb-8">
          <h3 className="text-2xl mb-2">Settings</h3>
          <div className="bg-white p-4 rounded shadow">
            <p>Configure site settings.</p>
            {/* Add settings management content here */}
          </div>
        </section>
        <section id="reports" className="mb-8">
          <h3 className="text-2xl mb-2">Reports</h3>
          <div className="bg-white p-4 rounded shadow">
            <p>View site reports.</p>
            {/* Add reports content here */}
          </div>
        </section>
      </main>
    </div>
  );

//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-0">
//       {/* First Section */}
//       <section id="first-section" className="relative flex justify-center items-center w-full py-8">
//         <div>
//           <h2 className="text-7xl">Please login to see this admin page</h2>
//         </div>
//       </section>
//     </main>
//   );
};

export default page
