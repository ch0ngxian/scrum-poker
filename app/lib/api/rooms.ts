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
    const [owner] = await api.users.get(document.data()?.owner.id);

    result = {
      id: document.id,
      owner: owner,
    } as IRoom;
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
