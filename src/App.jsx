import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, clearSelectedUser, setPage } from "./features/userSlice";
import { toggleTheme } from "./features/themeSlice";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";

function UserDetail({ user, onClose }) {
  if (!user) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-11/12 max-w-md sm:max-w-lg bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-2xl relative border border-blue-100 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={user.image}
          alt={user.firstName}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-4 border-4 border-blue-200 dark:border-blue-400 shadow"
        />
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-2 text-blue-700 dark:text-blue-200">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-4 break-words">
          Email: {user.email}
        </p>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
          Age: {user.age} • {user.gender}
        </p>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
          Company: {user.company?.name}
        </p>
        <button
          onClick={onClose}
          className="block mx-auto mt-2 px-6 sm:px-8 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors font-semibold shadow"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function UserDetailPage() {
  const { id } = useParams();
  const users = useSelector((state) => state.users.users);
  const user = users.find((u) => String(u.id) === id);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="text-lg sm:text-xl text-gray-500 mb-4">
          User not found.
        </div>
        <button
          className="px-5 sm:px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={() => navigate("/")}
        >
          Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-6 sm:p-8">
        <img
          src={user.image}
          alt={user.firstName}
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-4 border-4 border-blue-200 dark:border-blue-400 shadow"
        />
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3 text-blue-700 dark:text-blue-200">
          {user.firstName} {user.lastName}
        </h2>
        <div className="space-y-2 text-center text-gray-600 dark:text-gray-300">
          <p>Email: {user.email}</p>
          <p>
            Age: {user.age} • {user.gender}
          </p>
          <p>Company: {user.company?.name}</p>
          <p>Title: {user.company?.title}</p>
          <p>Phone: {user.phone}</p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="block mx-auto mt-6 px-6 sm:px-8 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors font-semibold shadow"
        >
          Back to List
        </button>
      </div>
    </div>
  );
}

function App() {
  const dispatch = useDispatch();
  const { users, selectedUser, loading, error, page, totalPages } = useSelector(
    (state) => state.users
  );
  const theme = useSelector((state) => state.theme.mode);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState(() => {
    const favs = localStorage.getItem("favorites");
    return favs ? JSON.parse(favs) : [];
  });
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUsers(page));
  }, [dispatch, page]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleFavorite = (userId) => {
    setFavorites((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-6 sm:py-8 transition-colors px-3 sm:px-4">
      <div className="w-full max-w-4xl bg-white/90 dark:bg-gray-900 shadow-2xl rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-blue-100 dark:border-gray-700 relative transition-colors">
        {/* Header row with theme toggle to avoid overlap */}
        <div className="flex items-center justify-end mb-4 sm:mb-6">
          <button
            className="px-3 py-1 text-xs sm:text-sm rounded-full bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-gray-200 font-semibold shadow hover:bg-blue-200 dark:hover:bg-gray-600 transition-colors"
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1 className="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8 text-center text-blue-700 dark:text-blue-200 drop-shadow">
                  User Directory Dashboard
                </h1>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full p-2.5 sm:p-3 mb-5 sm:mb-6 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 dark:bg-gray-800 placeholder:text-blue-300 dark:placeholder:text-gray-500 text-sm sm:text-base text-gray-900 dark:text-gray-100 transition-colors"
                />
                {loading && (
                  <div className="flex justify-center items-center py-8">
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 bg-blue-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <span className="ml-3 text-blue-500 dark:text-blue-300 font-semibold">
                      Loading users...
                    </span>
                  </div>
                )}
                {error && (
                  <div className="text-center text-red-500 dark:text-red-400 mb-2 font-medium">
                    {error}
                  </div>
                )}
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredUsers.map((user) => (
                    <li
                      key={user.id}
                      className="flex items-center bg-white/80 dark:bg-gray-800 shadow hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700 rounded-xl p-3 sm:p-4 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 group"
                      onClick={() => {
                        navigate(`/users/${user.id}`);
                      }}
                    >
                      <button
                        className="mr-3 sm:mr-4 focus:outline-none"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(user.id);
                        }}
                        aria-label={
                          favorites.includes(user.id)
                            ? "Unfavorite"
                            : "Favorite"
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill={
                            favorites.includes(user.id) ? "#facc15" : "none"
                          }
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke={
                            favorites.includes(user.id) ? "#f59e42" : "#cbd5e1"
                          }
                          className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors ${
                            favorites.includes(user.id) ? "drop-shadow" : ""
                          }`}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.48 3.499a1.7 1.7 0 0 1 3.04 0l2.09 4.23a1.7 1.7 0 0 0 1.28.93l4.67.68c1.47.21 2.06 2.02 1 3.06l-3.38 3.3a1.7 1.7 0 0 0-.49 1.5l.8 4.65c.25 1.46-1.28 2.57-2.6 1.88l-4.18-2.2a1.7 1.7 0 0 0-1.58 0l-4.18 2.2c-1.32.69-2.85-.42-2.6-1.88l.8-4.65a1.7 1.7 0 0 0-.49-1.5l-3.38-3.3c-1.06-1.04-.47-2.85 1-3.06l4.67-.68a1.7 1.7 0 0 0 1.28-.93l2.09-4.23z"
                          />
                        </svg>
                      </button>
                      <img
                        src={user.image}
                        alt={user.firstName}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full mr-4 sm:mr-5 border-2 border-blue-200 dark:border-blue-400 group-hover:border-blue-400 transition-all"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-base sm:text-lg text-blue-800 dark:text-blue-200 group-hover:text-blue-600 dark:group-hover:text-blue-300">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 group-hover:text-blue-400 dark:group-hover:text-blue-300 truncate max-w-[180px] sm:max-w-none">
                          {user.email}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4 my-6 sm:my-8 items-center">
                  <button
                    onClick={() => dispatch(setPage(page - 1))}
                    disabled={page <= 1 || loading}
                    className="w-full sm:w-auto px-4 sm:px-5 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold shadow hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
                  >
                    &lt; Prev
                  </button>
                  <span className="text-gray-700 dark:text-gray-200 font-medium order-first sm:order-none w-full text-center sm:w-auto">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => dispatch(setPage(page + 1))}
                    disabled={page >= totalPages || loading}
                    className="w-full sm:w-auto px-4 sm:px-5 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold shadow hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
                  >
                    Next &gt;
                  </button>
                </div>
                {selectedUser && (
                  <UserDetail
                    user={selectedUser}
                    onClose={() => {
                      dispatch(clearSelectedUser());
                      navigate("/");
                    }}
                  />
                )}
              </>
            }
          />
          <Route path="/users/:id" element={<UserDetailPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
