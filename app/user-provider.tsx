"use client";

import Cookies from "js-cookie";
import { createContext, useContext, useState, useEffect, SetStateAction, Dispatch } from "react";
import { api } from "./lib/api";

type IUser = null | {
  id: string;
  name: string;
};

const UserContext = createContext<[IUser, Dispatch<SetStateAction<IUser>>]>([null, (user) => {}]);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser>(null);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const id = Cookies.get("u");
    if (!id) return;

    const [user, error] = await api.users.get(id);
    if (!user) {
      Cookies.remove("u");
      return;
    }

    setUser(user);
    Cookies.set("u", user.id, { expires: 7 });

    return user;
  };

  return <UserContext.Provider value={[user, setUser]}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  return useContext(UserContext);
}
