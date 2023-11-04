import { create } from "zustand";
import { devtools } from "zustand/middleware";
import Cookies from "js-cookie";
// import User from "../types/user";
import { TOKEN, USER } from "../../constants";



// interface AuthState {
//   isAuthenticated: boolean;
//   user: null | User;
//   login: (values: User) => void;
// }


const useAuth = create()(
  devtools((set) => ({
    isAuthenticated: Boolean(Cookies.get(TOKEN)),
    user: localStorage.getItem(USER)
      ? JSON.parse(localStorage.getItem(USER) || "")
      : null,
    login: (user) => {
      set((state) => ({ ...state, isAuthenticated: true, user }));
    },
  }))
);

export default useAuth;
