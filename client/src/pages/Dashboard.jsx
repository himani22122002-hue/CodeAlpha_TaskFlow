import Navbar from "../components/Navbar";

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-xl p-6 border">
            <h2 className="text-lg font-semibold">Projects</h2>
            <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
          </div>

          <div className="bg-white shadow rounded-xl p-6 border">
            <h2 className="text-lg font-semibold">Tasks</h2>
            <p className="text-3xl font-bold text-green-600 mt-2">0</p>
          </div>

          <div className="bg-white shadow rounded-xl p-6 border">
            <h2 className="text-lg font-semibold">Completed</h2>
            <p className="text-3xl font-bold text-orange-500 mt-2">0</p>
          </div>
        </div>

        <div className="mt-10 bg-white shadow rounded-xl p-6 border">
          <h2 className="text-xl font-bold mb-3">Welcome to TaskFlow 🎉</h2>
          <p className="text-gray-600">
            Your project management dashboard is ready. Next we'll connect it
            to your backend and display real project and task data.
          </p>
        </div>
      </div>
    </>
  );
}