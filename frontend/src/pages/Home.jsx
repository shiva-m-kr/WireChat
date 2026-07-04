import { useSelector } from "react-redux";
import SideBar from "../components/SideBar";
import MessageArea from "../components/MessageArea";
import useGetMessages from "../customHooks/getMessages";

function Home() {

    const { selectedUser } = useSelector((state) => state.user);
    useGetMessages();
    return (
        <div className="w-full h-screen flex overflow-hidden">

            {/* ================= SIDEBAR ================= */}
            <div
                className={`
                    ${selectedUser ? "hidden" : "block"}
                    lg:block
                    lg:w-[30%]
                    w-full
                    h-full
                `}
            >
                <SideBar />
            </div>

            {/* ================= MESSAGE AREA ================= */}
            <div
                className={`
                    ${selectedUser ? "block" : "hidden"}
                    lg:block
                    lg:w-[70%]
                    w-full
                    h-full
                `}
            >
                <MessageArea />
            </div>

        </div>
    );
}

export default Home;