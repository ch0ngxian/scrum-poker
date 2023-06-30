import firebase from "../firebase";
import { getFirestore, collection, doc, addDoc, getDoc, DocumentData } from "firebase/firestore";

const firestore = getFirestore(firebase);

type ICreateRoom = {
  ownerId: string;
};

export const create = async (room: ICreateRoom): Promise<[DocumentData | undefined, any]> => {
  let result, error;

  try {
    result = await addDoc(collection(firestore, "rooms"), room);
  } catch (e) {
    error = e;
  }

  return [result, error];
};

export const get = async (id: string): Promise<[DocumentData | undefined, any]> => {
  let result, error;

  try {
    result = (await getDoc(doc(firestore, `rooms/${id}`))).data();
  } catch (e) {
    error = e;
  }

  return [result, error];
};
