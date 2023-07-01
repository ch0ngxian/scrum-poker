import firebase from "../firebase";
import { getFirestore, collection, doc, addDoc, getDoc, DocumentData } from "firebase/firestore";

const firestore = getFirestore(firebase);

type ICreateUser = {
  name: string;
};

export type IUser = {
  id: string;
  name: string;
};

export const create = async (user: ICreateUser): Promise<[IUser | null, any]> => {
  let result = null,
    error;

  try {
    const document = await addDoc(collection(firestore, "users"), user);
    [result] = await get(document.id);
  } catch (e) {
    error = e;
  }

  return [result, error];
};

export const get = async (id: string): Promise<[IUser | null, any]> => {
  let result = null,
    error;

  try {
    const document = await getDoc(doc(firestore, `users/${id}`));
    result = {
      id: document.id,
      ...document.data(),
    } as IUser;
  } catch (e) {
    error = e;
  }

  return [result, error];
};
