import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../main";
import { setMessages } from "../redux/messageSlice";

const useGetMessages = () => {
  const dispatch = useDispatch();
  const { userData, selectedUser } = useSelector((state) => state.user);

  useEffect(() => {
    // guard: need both a logged-in user AND a selected chat
    if (!userData?._id || !selectedUser?._id) return;

    const fetchMessages = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/message/get/${selectedUser._id}`,
          { withCredentials: true }
        );

        dispatch(setMessages(result.data));
      } catch (error) {
        console.log("Error fetching messages:", error);
      }
    };

    fetchMessages();
    // depend on IDs (primitives), not whole objects
  }, [userData?._id, selectedUser?._id, dispatch]);
};

export default useGetMessages;
