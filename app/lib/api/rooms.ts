import firebase from "../firebase";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  DocumentData,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  SnapshotOptions,
  arrayUnion,
  updateDoc,
  DocumentReference,
} from "firebase/firestore";
import { IUser } from "./users";
import { api } from "@/app/lib/api";

const firestore = getFirestore(firebase);

type CreateRoomParams = {
  owner: IUser;
};

type JoinRoomParams = {
  member: IUser;
};

export type IRoom = {
  id: string;
  owner: IUser;
  members: Array<{ user: IUser; is_moderator: boolean }>;
};

export const create = async (params: CreateRoomParams): Promise<[IRoom | null, any]> => {
  let result = null,
    error;

  try {
    const document = await addDoc(collection(firestore, "rooms"), {
      owner: doc(firestore, `users/${params.owner.id}`),
      members: [
        {
          user: doc(firestore, `users/${params.owner.id}`),
          is_moderator: true,
        },
      ],
    });
    [result] = await get(document.id);
  } catch (e) {
    error = e;
  }

  return [result, error];
};

export const get = async (id: string): Promise<[IRoom | null, any]> => {
  let result = null,
    error;

  try {
    const document = await getDoc(doc(firestore, `rooms/${id}`));

    if (document.exists()) {
      const data = document.data();
      const [owner] = await api.users.get(data.owner.id);

      const members = data.members.map(async ({ user, is_moderator }: { user: DocumentReference; is_moderator: boolean }) => {
        return {
          user: { id: user.id, ...(await getDoc(doc(firestore, `users/${user.id}`))).data() } as IUser,
          is_moderator: is_moderator,
        };
      });

      result = {
        id: document.id,
        owner: owner,
        members: await Promise.all(members),
      } as IRoom;
    }
  } catch (e) {
    error = e;
  }

  return [result, error];
};

export const join = async (id: string, params: JoinRoomParams): Promise<[boolean, any]> => {
  let result = false,
    error;

  try {
    const document = await updateDoc(doc(firestore, `rooms/${id}`), {
      members: arrayUnion({ user: doc(firestore, `users/${params.member.id}`), is_moderator: false }),
    });

    result = true;
  } catch (e) {
    error = e;
  }

  return [result, error];
};
