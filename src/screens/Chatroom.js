import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import styled, { ThemeContext } from "styled-components/native";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  doc,
  orderBy,
} from "firebase/firestore";
import { app, createMessage, getCurrentUser } from "../utils/firebase";
import { Bubble, GiftedChat, Send } from "react-native-gifted-chat";
import { Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
`;

const SendButton = (props) => {
  const theme = useContext(ThemeContext);
  return (
    <Send
      {...props}
      disabled={!props.text}
      containerStyle={{
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 4,
      }}
    >
      <MaterialIcons
        name="send"
        size={25}
        color={props.text ? theme.sendButtonActive : theme.sendButtonInactive}
      />
    </Send>
  );
};

const RenderBubble = (props) => {
  return (
    <Bubble
      {...props}
      textStyle={{ right: { color: "#FFFFFF" } }}
      wrapperStyle={{ left: { backgroundColor: "#5AAEFF" } }}
    />
  );
};

const Chatroom = ({ navigation, route }) => {
  const theme = useContext(ThemeContext);
  const { uid, name, photoUrl } = getCurrentUser();
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

  const _handleMessageButton = async (messageList) => {
    const newMessage = messageList[0];
    try {
      await createMessage({ channelId: route.params.id, message: newMessage });
    } catch (e) {
      Alert.alert("메시지 전송 실패", e.message);
    }
  };

  return (
    <Container>
      <GiftedChat
        listViewProps={{
          style: { backgroundColor: theme.background },
        }}
        placeholder="메시지를 입력하세요."
        messages={message}
        user={{ _id: uid, name, avatar: photoUrl }}
        onSend={_handleMessageButton}
        alwaysShowSend={true}
        textInputProps={{
          autoCapitalize: "none",
          autoCorrect: false,
          textContentType: "none",
          underlineColorAndroid: "transparent",
        }}
        multiline={false}
        renderUsernameOnmessage={true}
        scrollToBottom={true}
        renderSend={(props) => <SendButton {...props} />}
        renderBubble={(props) => <RenderBubble {...props} />}
      />
    </Container>
  );
};

export default Chatroom;
