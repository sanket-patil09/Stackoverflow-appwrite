import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { account } from "../models/client/config";
import { AppwriteException, ID, Models } from "appwrite";

export interface Userprefs {
  reputation: number;
}

interface IAuthStore {
  session: Models.Session | null;
  user: Models.User | null;
  jwt: string | null;
  hydrated: boolean;

  sethydrated(): void; // it will check if the store is hydrated and bring the usefull data from LS
  verifySession(): Promise<void>;
  login(
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: AppwriteException | null }>;
  CreateAccount(
    name: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: AppwriteException | null }>;
  logout(): Promise<void>;
}

export const useAuthStore = create<IAuthStore>()(
  persist(
    //all the functions that will modify the store must be inside the immer function
    immer((set) => ({
      session: null,
      jwt: null,
      user: null,
      hydrated: false,
      sethydrated() {
        set({ hydrated: true });
      },
      async verifySession() {
        try {
          const session = await account.getSession("current");
          set({ session });
        } catch (error) {
          console.log(error);
        }
      },

      async login(email: string, password: string) {
        try {
          const session = await account.createEmailPasswordSession(
            email,
            password,
          );
          const [user, { jwt }] = await Promise.all([
            account.get(),
            account.createJWT(),
          ]);
          if (!user.prefs?.reputation)
            await account.updatePrefs({ reputation: 0 });
          set({ session, user, jwt });
          return { success: true };
        } catch (error) {
          console.log(error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },

      async CreateAccount(name: string, email: string, password: string) {
        try {
          await account.create(ID.unique(), email, password, name);
          return { success: true };
        } catch (error) {
          console.log(error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },
      async logout() {
        await account.deleteSessions();
        set({ session: null, user: null, jwt: null });
      },
    })),
    {
      name: "auth",
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) state?.sethydrated();
        };
      },
    },
  ),
);
