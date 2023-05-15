import { initializeApp } from "firebase/app";
import {
  getAuth,
  signOut,
  updateProfile,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import config from "../../firebase.json";

const app = initializeApp(config);

const auth = getAuth(app);

export const login = async ({ email, password }) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
};

export const signup = async ({ email, password, name, photourl }) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  const photoURL = await uploadImage(photourl);
  await updateProfile(auth.currentUser, {
    displayName: name,
    photoURL,
  });
  return user;
};

// 이미지 업로드
const uploadImage = async (uri) => {
  // http가 붙어있어야 이미지 업로드
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
