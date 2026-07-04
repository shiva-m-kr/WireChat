import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",

  initialState: {
    userData: null,
    loading: true,
    otherUsers:null,
    selectedUser: null,
    socket:null,
    onlineUsers:null,
  },

  reducers: {
  setUserData: (state, action) => {
    state.userData = action.payload;
  },

  setOtherUsers: (state, action) => {
    state.otherUsers = action.payload;
  },

  setSelectedUser: (state, action) => {
    state.selectedUser = action.payload;
  },

  setLoading: (state, action) => {
    state.loading = action.payload;
  },

  setSocket: (state, action) => {
    state.socket = action.payload;
  },

  setOnlineUsers: (state, action) => {
    state.onlineUsers = action.payload;
  },
},
});

export const { setUserData, setLoading ,setSelectedUser,setOtherUsers,setSocket,setOnlineUsers} = userSlice.actions;
export default userSlice.reducer;
