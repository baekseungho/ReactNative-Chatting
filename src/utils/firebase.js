import { initializeApp } from "firebase/app";
import {
  getAuth,
  signOut,
  updateProfile,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import config from "../../firebase.json";

const app = initializeApp(config);

const auth = getAuth(app);

export const login = async ({ email, password }) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
};

export const signup = async ({ email, password }) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);

  return user;
};

// 이미지 업로드
const uploadImage = async (uri) => {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      reject(new TypeError("실패"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });
  const user = auth.currentUser;
  const ref = app.storage().ref(`./profile/${user.uid}/photo.png`);
  const snapshot = await ref.put(blob, { contentType: "image/png" });

  blob.close();
  return await snapshot.ref.getDownloadURL();
};
