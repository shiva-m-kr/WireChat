import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { FaCamera, FaArrowLeft } from "react-icons/fa";

import dp from "../assets/dp.avif";
import { serverUrl } from "../main";
import { setUserData } from "../redux/userSlice";

function Profile() {

    // ===========================
    // Redux
    // ===========================
    const { userData } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    // ===========================
    // Navigation
    // ===========================
    const navigate = useNavigate();

    // ===========================
    // State
    // ===========================

    // Stores updated name
    const [name, setName] = useState(userData.name || "");

    // Image shown on frontend
    const [frontendImage, setFrontendImage] = useState(
        userData.image || dp
    );

    // Original image file that will be sent to backend
    const [backendImage, setBackendImage] = useState(null);

    // Loading state while saving profile
    const [saving, setSaving] = useState(false);

    // ===========================
    // Ref
    // ===========================

    // Hidden file input
    const image = useRef();

    // ===========================
    // Handle Image Selection
    // ===========================

    const handleImage = (e) => {

        const file = e.target.files[0];

        // User clicked Cancel
        if (!file) return;

        // Store file for backend
        setBackendImage(file);

        // Show image preview immediately
        setFrontendImage(URL.createObjectURL(file));
    };

    // ===========================
    // Handle Profile Update
    // ===========================

    const handleProfile = async (e) => {

        e.preventDefault();

        setSaving(true);

        try {

            // Create multipart/form-data
            const formData = new FormData();

            // Append updated name
            formData.append("name", name);

            // Append image only if selected
            if (backendImage) {
                formData.append("image", backendImage);
            }

            // Send request
            const res = await axios.put(
                `${serverUrl}/api/user/profile`,
                formData,
                {
                    withCredentials: true
                }
            );

            // Update Redux
            dispatch(setUserData(res.data));

        } catch (error) {

            console.log(error);

        } finally {

            setSaving(false);

        }
    };

    return (

        <div className="w-full min-h-screen bg-slate-100 flex justify-center items-center p-4">

            {/* ===========================
                Back Button
            ============================ */}

            <button
                onClick={() => navigate("/")}
                className="absolute top-6 left-6 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full p-1 transition-colors cursor-pointer"
            >
                <FaArrowLeft />
            </button>

            {/* ===========================
                Profile Card
            ============================ */}

            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 flex flex-col items-center">

                {/* ===========================
                    Profile Image
                ============================ */}

                <div
                    className="relative mb-6 group"
                    onClick={() => image.current.click()}
                >

                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-200 shadow-md">

                        <img
                            src={frontendImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />

                    </div>

                    {/* Camera Icon */}

                    <button
                        type="button"
                        className="absolute bottom-1 right-1 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 shadow-lg cursor-pointer"
                    >
                        <FaCamera />
                    </button>

                </div>

                {/* Hidden Input */}

                <input
                    type="file"
                    accept="image/*"
                    hidden
                    ref={image}
                    onChange={handleImage}
                />

                {/* ===========================
                    Profile Form
                ============================ */}

                <form
                    className="w-full flex flex-col gap-4"
                    onSubmit={handleProfile}
                >

                    {/* Name */}

                    <div>

                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                            Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full px-4 py-2.5 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                        />

                    </div>

                    {/* Username */}

                    <div>

                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                            Username
                        </label>

                        <input
                            type="text"
                            readOnly
                            value={userData?.username || ""}
                            className="w-full px-4 py-2.5 rounded-lg border bg-slate-100 text-slate-500"
                        />

                    </div>

                    {/* Email */}

                    <div>

                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                            Email
                        </label>

                        <input
                            type="email"
                            readOnly
                            value={userData?.email || ""}
                            className="w-full px-4 py-2.5 rounded-lg border bg-slate-100 text-slate-500"
                        />

                    </div>

                    {/* Save Button */}

                    <button
                        type="submit"
                        disabled={saving}
                        className="mt-2 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition cursor-pointer"
                    >
                        {saving ? "Saving..." : "Save Profile"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Profile;