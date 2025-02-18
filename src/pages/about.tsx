const About = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">About Our Dashboard</h1>
      <p className="mb-2">
        This dashboard application is designed to help you manage and visualize
        your D&D 5e spell data efficiently. It provides a centralized place to
        view, search, and filter spell information, making it easier to plan
        your next adventure.
      </p>
      <h2 className="text-xl font-semibold mt-4 mb-2">Key Features:</h2>
      <ul className="list-disc list-inside">
        <li>
          Comprehensive Spell List: Access a complete list of D&D 5e spells.
        </li>
        <li>
          Detailed Spell Information: View detailed information for each spell,
          including description, casting time, range, components, and more.
        </li>
        <li>
          Search and Filtering: Quickly find the spells you need with powerful
          search and filtering capabilities.
        </li>
        <li>
          Responsive Design: The dashboard is designed to work seamlessly on
          all devices.
        </li>
      </ul>
      <p className="mt-4">
        This project was built with React, Redux, Tailwind CSS, and Shadcn UI.
      </p>
    </div>
  );
};

export default About;