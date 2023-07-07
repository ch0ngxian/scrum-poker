"use client";

import Cookies from "js-cookie";
import { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/lib/types";

const UserContext = createContext<[User | null, ({ name }: { name: string }) => Promise<User | null>]>([
  null,
  async () => {
    return null;
  },
]);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const token = Cookies.get("u");
    if (!token) return;

    const response = await fetch(`/api/users`);
    const user = (await response.json()) as User;

    if (!user) {
      Cookies.remove("u");
      return;
    }

    setUser(user as User);
    Cookies.set("u", `${user.token}`, { expires: 7 });

    return user;
  };

  const createUser = async ({ name }: { name: string }) => {
    const response = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({ name: name }),
    });

    const user = (await response.json()) as User;

    setUser(user);
    Cookies.set("u", `${user.token}`, { expires: 7 });

    return user;
  };

  return <UserContext.Provider value={[user, createUser]}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  return useContext(UserContext);
}
