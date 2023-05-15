import React, { useEffect, useRef, useState, useContext } from "react";
import styled from "styled-components/native";
import { Image, Input, Button } from "../components";
import { images } from "../utils/images";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { validateEmail, removeWhitespace } from "../utils/common";
import { Alert } from "react-native";
import { login } from "../utils/firebase";
import { ProgressContext } from "../contexts";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
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

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const passwordRef = useRef();
  const [errorMsg, setErrorMsg] = useState("");
  const [disabled, setDisabled] = useState(true);

  const { spinner } = useContext(ProgressContext);

  useEffect(() => {
    // 로그인 버튼 활성화 여부 (이메일, 패스워드값존재, 에러메시지 값없음)
    setDisabled(!(email && password && !errorMsg));
  }, [email, password, errorMsg]);

  const _handleEmail = (email) => {
    const changedEmail = removeWhitespace(email);
    setEmail(changedEmail);
    setErrorMsg(validateEmail(changedEmail) ? "" : "이메일을 확인해주세요");
  };
  const _handlePassword = (password) => {
    setPassword(removeWhitespace(password));
  };

  const _handleLoginButton = async () => {
    try {
      spinner.start();
      const user = await login({ email, password });
      Alert.alert("로그인 성공", user.email);
    } catch (e) {
      Alert.alert("로그인 오류", e.messgae);
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
        <Image url={images.logo} />
        <Input
          label="Email"
          value={email}
          onChangeText={_handleEmail}
          onSubmitEditing={() => passwordRef.current.focus()} // 입력후 엔터버튼누르면 다음으로 포커스넘어가게
          placeholder="Email"
          returnKeyType="next"
        />
        <Input
          ref={passwordRef}
          label="Password"
          value={password}
          onChangeText={_handlePassword}
          onSubmitEditing={_handleLoginButton}
          placeholder="Password"
          returnKeyType="done"
          isPassword
        />
        <ErrorText>{errorMsg}</ErrorText>
        <Button
          title="Login"
          onPress={_handleLoginButton}
          disabled={disabled}
        />
        <Button
          title="signup"
          onPress={() => navigation.navigate("Signup")}
          isFilled={false}
        />
      </Container>
    </KeyboardAwareScrollView>
  );
};

export default Login;
