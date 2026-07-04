import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../main";
import { setOtherUsers } from "../redux/userSlice";

const useGetOtherUsers = () => {
  // ================= Redux =================
  const dispatch = useDispatch();

  // Logged-in user
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    // Don't call API until user data is available
    if (!userData) return;

    const fetchOtherUsers = async () => {
      try {
        // Fetch all users except the logged-in user
        const result = await axios.get(
          `${serverUrl}/api/user/others`,
          {
            withCredentials: true,
          }
        );

        // Save users in Redux
        dispatch(setOtherUsers(result.data));
      } catch (error) {
        console.log(
          "Error fetching users:",
          error.response?.data || error.message
        );
      }
    };

    fetchOtherUsers();
  }, [userData, dispatch]);
};

export default useGetOtherUsers;
