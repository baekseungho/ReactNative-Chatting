import React, { useState, useRef, useEffect, useContext } from "react";
import { Alert } from "react-native";
import { ProgressContext } from "../contexts";
import styled from "styled-components/native";
import { Input, Button } from "../components";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { createChannel } from "../utils/firebase";

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  justify-content: center;
  align-items: center;
  padding: 0 20px;
`;

const ErrorText = styled.Text`
  align-items: flex-start;
  width: 100%;
  height: 20px;
  margin-bottom: 10px;
  line-height: 20px;
  color: ${({ theme }) => theme.errorText};
`;

const ChatroomCreation = ({ navigation }) => {
  const { spinner } = useContext(ProgressContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [disabled, setDisabled] = useState(true);

  const descriptionRef = useRef();

  useEffect(() => {
    setDisabled(!(title && !errorMsg));
  }, [title, description, errorMsg]);
  const _handleTitleChange = (title) => {
    setTitle(title);
    setErrorMsg(title.trim() ? "" : "제목입력하세요");
  };

  const _handleCreateButton = async () => {
    try {
      spinner.start();
      const id = await createChannel({ title, description });
      navigation.replace("ChatRoom", { id, title });
    } catch (e) {
      Alert.alert("대화방만들기 실패", e.message);
    } finally {
      spinner.stop();
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flex: 1 }}
      extraScrollHeight={20}
    >
      <Container>
        <Input
          label="Title"
          value={title}
          onChangeText={_handleTitleChange}
          onSubmitEditing={() => {
            setTitle(title.trim());
            descriptionRef.current.focus();
          }}
          placeholder="Title"
          returnKeyType="next"
          maxLength={20}
        />
        <Input
          ref={descriptionRef}
          label="Description"
          value={description}
          onChangeText={(text) => setDescription(text)}
          onSubmitEditing={() => {
            setDescription(description.trim());
            _handleCreateButton();
          }}
          placeholder="설명"
          returnKeyType="done"
          maxLength={40}
        />
        <ErrorText>{errorMsg}</ErrorText>
        <Button
          title="생성"
          onPress={_handleCreateButton}
          disabled={disabled}
        />
      </Container>
    </KeyboardAwareScrollView>
  );
};

export default ChatroomCreation;
