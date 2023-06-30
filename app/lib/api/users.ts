import firebase from "../firebase";
import { getFirestore, collection, doc, addDoc, getDoc, DocumentData } from "firebase/firestore";

const firestore = getFirestore(firebase);

type ICreateUser = {
  name: string;
};

export const create = async (user: ICreateUser): Promise<[DocumentData | undefined, any]> => {
  let result, error;

  try {
    result = await addDoc(collection(firestore, "users"), user);
  } catch (e) {
    error = e;
  }

  return [result, error];
};

export const get = async (id: string): Promise<[DocumentData | undefined, any]> => {
  let result, error;

  try {
    result = await getDoc(doc(firestore, `users/${id}`));
  } catch (e) {
    error = e;
  }

  return [result, error];
};
