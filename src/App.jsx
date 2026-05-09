import { useEffect, useState } from "react";
const API = import.meta.env.VITE_API_BASE_URL;

export default function App() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
  });

  const [formErrors, setFormErrors] = useState({});

  // fetching users at first
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const res = await fetch(`api/users`);

        const data = await res.json();

        const userData = data.data || data || [];

        setUsers(userData);
        setFilteredUsers(userData);
      } catch (err) {
        console.log("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = users.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase()),
      );

      setFilteredUsers(filtered);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, users]);

  const sortAZ = () => {
    const sorted = [...filteredUsers].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    setFilteredUsers(sorted);
  };

  const sortZA = () => {
    const sorted = [...filteredUsers].sort((a, b) =>
      b.name.localeCompare(a.name),
    );
    setFilteredUsers(sorted);
  };

  const reset = () => {
    setSearch("");
    setFilteredUsers(users);
  };


const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};

// validate the inputs
const validate = () => {
  let errors = {};

  if (!formData.name.trim()) errors.name = "Name is required";
  if (!formData.email.trim()) errors.email = "Email is required";
  if (!formData.company.trim()) errors.company = "Company is required";
  if (!formData.phone.trim()) errors.phone = "Phone is required";

  setFormErrors(errors);

  return Object.keys(errors).length === 0;
};


// handle form 
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validate()) return;

  try {
    const res = await fetch(`api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    const newUser = data.data || data;

    // 🔥 prepend user
    setUsers((prev) => [newUser, ...prev]);
    setFilteredUsers((prev) => [newUser, ...prev]);

    // reset form
    setFormData({ name: "", email: "", company: "", phone: "" });
    setFormErrors({});
    setShowModal(false);

  } catch (err) {
    console.log("Error adding user:", err);
  }
};

  return (
    <>
    
    <div className="min-h-screen bg-gray-100 p-6">
      {/* HEADER */}
      <div className="max-w-5xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-800">User Directory</h1>
        <p className="text-gray-500">Search and explore users</p>
      </div>

      {/* SEARCH BAR */}
      <div className="max-w-5xl mx-auto mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* SORT BUTTONS */}
      <div className="max-w-5xl mx-auto mb-6 flex gap-3">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={sortAZ}
        >
          A → Z
        </button>

        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={sortZA}
        >
          Z → A
        </button>

        <button
          className="px-4 py-2 bg-gray-400 text-white rounded"
          onClick={reset}
        >
          Reset
        </button>

        {/* add user button */}
        <div className="max-w-5xl mx-auto mb-4 flex justify-end">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            + Add User
          </button>
        </div>
      </div>

      {/* USERS GRID */}

      {/* CARD 1 */}
      {/* <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {error && (
          <p className="text-red-500 col-span-full text-center">{error}</p>
        )}

        {!error && filteredUsers.length === 0 && (
          <p className="text-gray-500 col-span-full text-center">
            No users found
          </p>
        )}

        {filteredUsers.map((user, index) => (
          <div className="bg-white p-4 rounded-lg shadow" key={index}>
            <h2 className="text-lg font-semibold">
              {user.name?.charAt(0).toUpperCase() + user.name?.slice(1)}
            </h2>

            <p className="text-gray-500">{user.email}</p>
            <p className="text-gray-400">{user.phone}</p>
            <p className="text-gray-400">{user.company}</p>
          </div>
        ))}
      </div> */}

      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {error && (
          <p className="text-red-500 col-span-full text-center">{error}</p>
        )}

        {!loading && !error && filteredUsers.length === 0 && (
          <p className="text-gray-500 col-span-full text-center">
            No users found
          </p>
        )}

        {!loading &&
          filteredUsers.map((user, index) => (
            <div className="bg-white p-4 rounded-lg shadow" key={index}>
              <h2 className="text-lg font-semibold">
                {user.name?.charAt(0).toUpperCase() + user.name?.slice(1)}
              </h2>

              <p className="text-gray-500">{user.email}</p>
              <p className="text-gray-400">{user.phone}</p>
              <p className="text-gray-400">{user.company}</p>
            </div>
          ))}
      </div>
    </div>

    {/* show model */}
    {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
    
    <div className="bg-white p-6 rounded-lg w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Add User</h2>

      <form onSubmit={handleSubmit} className="space-y-3">

        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-2 border rounded"
        />
        {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}

        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 border rounded"
        />
        {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}

        <input
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Company"
          className="w-full p-2 border rounded"
        />
        {formErrors.company && <p className="text-red-500 text-sm">{formErrors.company}</p>}

        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full p-2 border rounded"
        />
        {formErrors.phone && <p className="text-red-500 text-sm">{formErrors.phone}</p>}

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-3 py-1 bg-gray-400 text-white rounded"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            Add
          </button>
        </div>

      </form>
    </div>

  </div>
)}
</>
  );
}
