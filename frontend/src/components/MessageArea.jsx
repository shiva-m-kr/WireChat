import dp from "../assets/dp.avif";

import { useState, useRef, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { setSelectedUser} from "../redux/userSlice";

import axios from "axios";
import { serverUrl } from "../main";

import EmojiPicker from "emoji-picker-react";

import { FaRegImages } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoArrowBackSharp } from "react-icons/io5";
import { setMessages } from "../redux/messageSlice";
// Components (used later when rendering messages)
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";

function MessageArea() {
  // ===========================
  // Redux
  // ===========================

  const { selectedUser, userData, socket, onlineUsers } = useSelector(
  (state) => state.user
);
  const dispatch = useDispatch();

  // ===========================
  // Local State
  // ===========================

  const [showPicker, setShowPicker] = useState(false);
  const [input, setInput] = useState("");

  // Image preview shown on frontend
  const [frontendImage, setFrontendImage] = useState(null);

  // Actual image sent to backend
  const [backendImage, setBackendImage] = useState(null);

  // ===========================
  // Refs
  // ===========================

  const imageRef = useRef(null);
  let { messages } = useSelector((state) => state.message)
  // ===========================
  // Handle Image Selection
  // ===========================

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Remove previous preview URL
    if (frontendImage) {
      URL.revokeObjectURL(frontendImage);
    }

    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  // ===========================
  // Emoji Picker
  // ===========================

  const onEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
    setShowPicker(false);
  };
 useEffect(() => {
  if (!socket) return;

  const handleNewMessage = (mess) => {
    dispatch(setMessages([...messages, mess]));
  };

  socket.on("newMessage", handleNewMessage);

  return () => {
    socket.off("newMessage", handleNewMessage);
  };
}, [socket, messages, dispatch]);
  // ===========================
  // Send Message
  // ===========================

  const handleSendMessage = async (e) => {
    e.preventDefault();

    // Prevent empty messages
    if (!input.trim() && !backendImage) return;

    try {
      const formData = new FormData();

      formData.append("message", input);

      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        {
          withCredentials: true,
        }
      );
     dispatch(setMessages([...messages, result.data]));

      console.log(result.data);

      // ===========================
      // Clear Inputs
      // ===========================

      setInput("");

      setBackendImage(null);

      if (frontendImage) {
        URL.revokeObjectURL(frontendImage);
      }

      setFrontendImage(null);

      if (imageRef.current) {
        imageRef.current.value = "";
      }
    } catch (error) {
      console.log(error.response?.data);
      console.log(error.response?.data?.message);
      console.log(error.message);
    }
  };

  // ===========================
  // Cleanup Object URL
  // ===========================

  useEffect(() => {
    return () => {
      if (frontendImage) {
        URL.revokeObjectURL(frontendImage);
      }
    };
  }, [frontendImage]);

  // ===========================
  // JSX
  // ===========================

  return (<div className="relative w-full h-full flex flex-col bg-[#f8fafc]">
    {selectedUser ? (
      <>
        {/* ===========================
              HEADER
          =========================== */}

        <div className="w-full h-20 bg-[#11998e] shadow-md flex items-center px-5 flex-shrink-0">

          {/* Back Button */}
          <button
            type="button"
            onClick={() => dispatch(setSelectedUser(null))}
            className="
                w-10 h-10
                rounded-full
                flex items-center justify-center
                text-white
                hover:bg-white/10
                active:scale-95
                transition
              "
          >
            <IoArrowBackSharp className="text-2xl" />
          </button>

          {/* User Info */}
          <div className="flex items-center gap-3 ml-3">

            <img
              src={selectedUser.image || dp}
              alt={selectedUser.name}
              className="
                  w-12
                  h-12
                  rounded-full
                  object-cover
                  border-2
                  border-white
                "
            />

            <div>

              <h2 className="text-white font-semibold text-lg">
                {selectedUser.name}
              </h2>

              {/* Online Status */}
              <p className="text-xs text-white/80">
                {onlineUsers?.includes(selectedUser._id) ? "Online" : "Offline"}
              </p>

            </div>

          </div>

        </div>



        {/* ===========================
              CHAT AREA
          =========================== */}

        <div
          className="
              flex-1
              overflow-y-auto
              bg-[#eef2f7]
              px-6
              py-5
              relative
            "
        >

          {/* ===========================
                EMOJI PICKER
            =========================== */}

          {showPicker && (

            <div
              className="
                  absolute
                  bottom-4
                  left-4
                  z-50
                "
            >

              <EmojiPicker
                width={window.innerWidth < 640 ? 300 : 350}
                height={350}
                onEmojiClick={onEmojiClick}
              />

            </div>


          )}
          

          {/* ===========================
                MESSAGES
            =========================== */}

          <div className="flex flex-col gap-3">

            {messages?.map((mess) => (
            String(mess.sender) === String(userData._id) ? (
              <SenderMessage
                key={mess._id}
                image={mess.image}
                message={mess.message}
              />
            ) : (
              <ReceiverMessage
                key={mess._id}
                image={mess.image}
                message={mess.message}
              />
            )
          ))}

          </div>

        </div>



        {/* ===========================
              IMAGE PREVIEW
          =========================== */}

        {frontendImage && (

          <div
            className="
                absolute
                bottom-24
                right-4
                sm:right-6
                z-40
              "
          >

            <img
              src={frontendImage}
              alt="Preview"
              className="
                  w-[140px]
                  sm:w-[180px]
                  lg:w-[260px]
                  rounded-xl
                  shadow-xl
                  border
                  border-gray-200
                "
            />

          </div>

        )}



        {/* ===========================
              INPUT SECTION
          =========================== */}

        <div
          className="
              bg-[#f0f2f5]
              border-t
              border-gray-200
              px-4
              py-3
            "
        >

          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2"
          >

            {/* Emoji */}

            <button
              type="button"
              onClick={() => setShowPicker(!showPicker)}
              className="
                  w-10
                  h-10
                  flex
                  items-center
                  justify-center
                  text-gray-500
                  hover:text-gray-700
                  active:scale-95
                  transition
                "
            >

              <RiEmojiStickerLine className="text-2xl" />

            </button>



            {/* Hidden Image Input */}

            <input
              type="file"
              hidden
              ref={imageRef}
              accept="image/*"
              onChange={handleImage}
            />



            {/* Image Button */}

            <button
              type="button"
              onClick={() => imageRef.current.click()}
              className="
                  w-10
                  h-10
                  flex
                  items-center
                  justify-center
                  text-gray-500
                  hover:text-gray-700
                  active:scale-95
                  transition
                "
            >

              <FaRegImages className="text-2xl" />

            </button>



            {/* Message Input */}

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="
                  flex-1
                  h-10
                  px-4
                  rounded-lg
                  border
                  border-gray-300
                  bg-white
                  text-sm
                  outline-none
                  focus:border-[#11998e]
                "
            />



            {/* Send Button */}

            <button
              type="submit"
              className="
                  w-10
                  h-10
                  flex
                  items-center
                  justify-center
                  text-[#00a884]
                  hover:text-[#008f72]
                  active:scale-95
                  transition
                "
            >

              <IoMdSend className="text-2xl" />

            </button>

          </form>

        </div>

      </>
    ) : (

      /* ===========================
          NO CHAT SELECTED
      =========================== */

      <div
        className="
            w-full
            h-full
            flex
            flex-col
            justify-center
            items-center
            text-center
          "
      >

        <img
          src="/logo.png"
          alt="WireChat"
          className="w-24 opacity-20 mb-6"
        />

        <h2 className="text-2xl font-semibold text-gray-700">
          Welcome to WireChat
        </h2>

        <p className="text-gray-500 mt-2">
          Select a user from the sidebar to start chatting.
        </p>

      </div>

    )}
  </div>
  );
}

export default MessageArea;