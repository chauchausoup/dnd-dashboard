const Home = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">
        Welcome to Your Dashboard!
      </h1>
      <p className="mb-4">
        Get started by exploring your data using the
        navigation links on the sidebar.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-secondary rounded-md">
          <h2 className="text-xl font-semibold mb-2">
            Recent Activity
          </h2>
          <ul className="list-disc list-inside">
            <li>Viewed Animate Objects spell</li>
            <li>Searched for "Fireball"</li>
            <li>Updated profile settings</li>
          </ul>
        </div>
        <div className="p-4 bg-secondary rounded-md">
          <h2 className="text-xl font-semibold mb-2">
            Quick Links
          </h2>
          <ul className="list-disc list-inside">
            <li>
              <a href="/spells" className="text-blue-500">
                Check Spells
              </a>
            </li>
            <li>Browse Classes</li>
            <li>Edit Profile</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
