import React, { useState, useEffect, useLayoutEffect } from "react";
import styled from "styled-components/native";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  doc,
  orderBy,
} from "firebase/firestore";
import { app, createMessage, getCurrentUser } from "../utils/firebase";
import { Text, FlatList } from "react-native";
import { Input } from "../components";

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
`;

const Chatroom = ({ navigation, route }) => {
  const [message, setMessage] = useState([]);
  const [text, setText] = useState([]);

  const db = getFirestore(app);
  useEffect(() => {
    const docRef = doc(db, "channels", route.params.id);
    const collectionQuery = query(
      collection(db, `${docRef.path}/messages`),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(collectionQuery, (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        list.push(doc.data());
      });
      setMessage(list);
    });
    return () => unsubscribe();
  }, []);
  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: route.params.title || "ChatRoom" });
  }, []);

  return (
    <Container>
      <FlatList
        keyExtractor={(item) => item["id"]}
        data={message}
        renderItem={({ item }) => <Text>{item.text}</Text>}
      />
      <Input
        value={text}
        onChangeText={(text) => setText(text)}
        onSubmitEditing={() =>
          createMessage({ channelId: route.params.id, message: text })
        }
      />
    </Container>
  );
};

export default Chatroom;
