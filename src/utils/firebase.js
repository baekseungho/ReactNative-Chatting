import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import config from "../../firebase.json";
import { getFirestore, collection, setDoc, doc } from "firebase/firestore";

export const app = initializeApp(config);

const auth = getAuth(app);

export const login = async ({ email, password }) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
};

export const signup = async ({ email, password, name, photourl }) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  const photoURL = await uploadImage(photourl);
  await updateProfile(auth.currentUser, { displayName: name, photoURL });
  return user;
};

// 이미지 업로드
const uploadImage = async (uri) => {
  if (uri.startsWith("https")) {
    return uri;
  }
  const response = await fetch(uri);
  const blob = await response.blob();
  const { uid } = auth.currentUser;
  const storage = getStorage(app);
  const storageRef = ref(storage, `/profile/${uid}/photo.png`);
  await uploadBytes(storageRef, blob, { contentType: "image/png" });
  return await getDownloadURL(storageRef);
};

export const getCurrentUser = () => {
  const { uid, displayName, email, photoURL } = auth.currentUser;
  return { uid, name: displayName, email, photoUrl: photoURL };
};

export const updateUserInfo = async (photo) => {
  const photoUrl = await uploadImage(photo);
  await updateProfile(auth.currentUser, { photoUrl });
  return photoUrl;
};

export const signout = async () => {
  await signOut(auth);
  return {};
};

const db = getFirestore(app);

export const createChannel = async ({ title, description }) => {
  const chCollection = collection(db, "channels");
  const newChannelRef = doc(chCollection);
  const id = newChannelRef.id;
  const newChannel = {
    id,
    title,
    description,
    createdAt: Date.now(),
  };
  await setDoc(newChannelRef, newChannel);
  return id;
};

export const createMessage = async ({ channelId, message }) => {
  const docRef = doc(db, `channels/${channelId}/messages`, message);
  await setDoc(docRef, { ...message, createdAt: Date.now() });
};
