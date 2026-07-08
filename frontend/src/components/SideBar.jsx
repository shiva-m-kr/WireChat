import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdOutlineSearch } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { TbLogout2 } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import dp from "../assets/dp.avif";
import { serverUrl } from "../main";
import {
  setOtherUsers,
  setSelectedUser,
  setUserData,
} from "../redux/userSlice";

function SideBar() {
  const { userData, otherUsers, onlineUsers, selectedUser } = useSelector(
  (state) => state.user
);

  const [search, setSearch] = useState(false);
  const [searchText, setSearchText] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });

      dispatch(setUserData(null));
      dispatch(setOtherUsers(null));

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  // ================= SORT ONLINE USERS =================

  const sortedUsers = [...(otherUsers || [])].sort((a, b) => {
    const aOnline = onlineUsers?.includes(a._id);
    const bOnline = onlineUsers?.includes(b._id);

    if (aOnline === bOnline) return 0;

    return aOnline ? -1 : 1;
  });

  const filteredUsers = sortedUsers.filter((user) =>
  (user?.name || "").toLowerCase().includes((searchText || "").toLowerCase())
);

  return (
    <div className="w-full h-full flex flex-col bg-slate-100 border-r border-slate-200">

      {/* ================= HEADER ================= */}

      <div
        className="
          relative
          px-6
          pt-8
          pb-8
          bg-gradient-to-br
          from-emerald-500
          via-teal-500
          to-cyan-500
          rounded-b-[35px]
          shadow-2xl
        "
      >

        {/* App */}

        <div className="flex items-center justify-center gap-3">

          <img
            src="/logo.png"
            alt="logo"
            className="w-12 h-12 object-contain"
          />

          <h1 className="text-3xl font-bold tracking-wide text-white">
            WireChat
          </h1>

        </div>

        {/* User */}

        <div className="mt-10 flex items-center justify-between">

          <div>

            <p className="text-white/80 text-sm font-medium">
              Welcome Back 👋
            </p>

            <h2 className="text-3xl font-bold text-white mt-1 break-words">

              {userData?.name || userData?.username}

            </h2>

          </div>
          {/* image to profile nevigate */}
          <div
  onClick={() => navigate("/profile")}
  className="
    w-24
    h-24
    rounded-full
    overflow-hidden
    border-4
    border-white
    shadow-2xl
    ring-4
    ring-white/20
    cursor-pointer
    hover:scale-105
    transition-all
    duration-300
  "
>
  <img
    src={userData?.image || dp}
    alt="profile"
    className="w-full h-full object-cover"
  />
          </div>

        </div>

        {/* Search */}

        {/* Search */}

<div className="mt-8">

  {!search ? (

    <button
      onClick={() => setSearch(true)}
      className="
        w-full
        h-12
        rounded-full
        bg-white/20
        backdrop-blur-md
        border
        border-white/20
        text-white
        flex
        items-center
        justify-center
        gap-2
        hover:bg-white/30
        transition-all
        duration-300
      "
    >

      <MdOutlineSearch className="text-2xl" />

      <span className="font-medium">
        Search Users
      </span>

    </button>

  ) : (

    <div
      className="
        h-12
        bg-white
        rounded-full
        shadow-xl
        flex
        items-center
        px-4
      "
    >

      <MdOutlineSearch className="text-2xl text-slate-500" />

      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Search user..."
        className="
          flex-1
          h-full
          px-3
          bg-transparent
          outline-none
          text-slate-700
          placeholder:text-slate-400
        "
      />

      <button
        type="button"
        onClick={() => {
          setSearch(false);
          setSearchText("");
        }}
        className="
          w-9
          h-9
          rounded-full
          flex
          items-center
          justify-center
          hover:bg-slate-100
          transition
        "
      >

        <RxCross2 className="text-xl text-slate-500" />

      </button>

    </div>

  )}

</div>

      </div>

      {/* ================= USER LIST ================= */}

      <div
        className="
          flex-1
          overflow-y-auto
          px-4
          py-5
          bg-gradient-to-b
          from-slate-100
          via-slate-50
          to-white
          space-y-3
        "
      >
                {filteredUsers.length > 0 ? (

          filteredUsers.map((user) => {

            const isOnline = onlineUsers?.includes(user._id);
            const isSelected = user._id === selectedUser?._id;

            return (

              <div
                key={user._id}
                onClick={() => dispatch(setSelectedUser(user))}
                className={`
                  relative
                  flex
                  items-center
                  gap-4
                  p-4
                  rounded-2xl
                  cursor-pointer
                  transition-all
                  duration-300
                  border
                  shadow-sm
                  hover:shadow-xl
                  hover:-translate-y-1
                  ${
                    isSelected
                      ? "bg-emerald-100 border-emerald-500 shadow-lg"
                      : "bg-white border-slate-200 hover:bg-emerald-50"
                  }
                `}
              >

                {/* Avatar */}

                <div className="relative flex-shrink-0">

                  <img
                    src={user.image || dp}
                    alt={user.name || user.username}
                    className="
                      w-14
                      h-14
                      rounded-full
                      object-cover
                      border-2
                      border-white
                      shadow-md
                    "
                  />

                  {isOnline && (
                    <span
                      className="
                        absolute
                        bottom-0
                        right-0
                        w-4
                        h-4
                        rounded-full
                        bg-green-500
                        border-[3px]
                        border-white
                      "
                    />
                  )}

                </div>

                {/* User Details */}

                <div className="flex-1 min-w-0">

                  <h2
                    className="
                      text-slate-1000
                      font-semibold
                      truncate
                    "
                  >
                    {user.name || user.username}
                  </h2>

                  <p
                    className={`
                      text-sm
                      mt-1
                      ${
                        isOnline
                          ? "text-green-600 font-medium"
                          : "text-slate-500"
                      }
                    `}
                  >
                    {isOnline ? "● Online" : "Offline"}
                  </p>

                </div>
          </div>


            );

          })

        ) : (

          <div
            className="
              h-full
              flex
              flex-col
              justify-center
              items-center
              text-center
              px-6
            "
          >

            <img
              src="/logo.png"
              alt="logo"
              className="w-20 opacity-20 mb-6"
            />

            <h2 className="text-xl font-semibold text-slate-700">
              No Users Found
            </h2>

            <p className="text-slate-500 mt-2">
              Search for a user to start chatting.
            </p>

          </div>

        )}

      </div>

      {/* ================= FOOTER ================= */}

      <div
        className="
          p-5
          bg-white
          border-t
          border-slate-200
          shadow-[0_-5px_15px_rgba(0,0,0,0.03)]
        "
      >

        <button
          onClick={handleLogOut}
          className="
            w-full
            h-12
            rounded-xl
            bg-gradient-to-r
            from-blue-600
            to-cyan-600
            text-white
            font-semibold
            flex
            items-center
            justify-center
            gap-2
            hover:from-red-500
            hover:to-red-600
            transition-all
            duration-300
            shadow-lg
          "
        >

          <TbLogout2 className="text-xl" />

          Logout

        </button>

      </div>

    </div>
  );
}

export default SideBar;