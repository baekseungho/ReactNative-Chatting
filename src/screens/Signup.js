import React, { useEffect, useRef, useState, useContext } from "react";
import styled from "styled-components/native";
import { Image, Input, Button } from "../components";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { validateEmail, removeWhitespace } from "../utils/common";
import { images } from "../utils/images";
import { Alert } from "react-native";
import { signup } from "../utils/firebase";
import { ProgressContext, UserContext } from "../contexts";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
  padding: 40px 20px;
`;
const ErrorText = styled.Text`
  align-items: flex-start;
  width: 100%;
  height: 20px;
  margin-bottom: 10px;
  line-height: 20px;
  color: ${({ theme }) => theme.errorText};
`;

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [name, setName] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [photourl, setPhotourl] = useState(images.photo);

  const passwordRef = useRef();
  const emailRef = useRef();
  const passwordConfirmRef = useRef();
  const didMountRef = useRef();

  const { spinner } = useContext(ProgressContext);
  const { dispatch } = useContext(UserContext);

  useEffect(() => {
    // 로그인 버튼 활성화 여부 (이메일, 패스워드값존재, 에러메시지 값없음)
    setDisabled(!(name && passwordConfirm && email && password && !errorMsg));
  }, [name, passwordConfirm, email, password, errorMsg]);

  useEffect(() => {
    if (didMountRef.current) {
      let _errorMsg = "";
      if (!name) {
        _errorMsg = "이름을 입력하세요";
      } else if (!validateEmail(email)) {
        _errorMsg = "이메일을 확인하세요";
      } else if (password.length < 6) {
        _errorMsg = "비밀번호는 6자 이상 입력하세요.";
      } else if (password !== passwordConfirm) {
        _errorMsg = "비밀번호가 일치하지 않습니다.";
      } else {
        _errorMsg = "";
      }
      setErrorMsg(_errorMsg);
    } else {
      didMountRef.current = true;
    }
  }, [name, email, password, passwordConfirm]);

  const _handleSignupButton = async () => {
    try {
      spinner.start();
      const user = await signup({ email, password, name, photourl });
      // Alert.alert("가입 성공", user.email);
      dispatch(user);
    } catch (e) {
      Alert.alert("가입 오류", e.message);
    } finally {
      spinner.stop();
    }
  };
  return (
    <KeyboardAwareScrollView extraScrollHeight={20}>
      <Container>
        <Image
          rounded
          url={photourl}
          showButton
          onChangeImage={(url) => setPhotourl(url)}
        />
        <Input
          label="Name"
          value={name}
          onChangeText={(text) => setName(text)}
          onSubmitEditing={() => {
            setName(name.trim());
            emailRef.current.focus();
          }} // 입력후 엔터버튼누르면 다음으로 포커스넘어가게
          placeholder="Name"
          returnKeyType="next"
        />
        <Input
          ref={emailRef}
          label="Email"
          value={email}
          onChangeText={(text) => setEmail(removeWhitespace(text))}
          onSubmitEditing={() => passwordRef.current.focus()} // 입력후 엔터버튼누르면 다음으로 포커스넘어가게
          placeholder="Email"
          returnKeyType="next"
        />
        <Input
          ref={passwordRef}
          label="Password"
          value={password}
          onChangeText={(text) => setPassword(removeWhitespace(text))}
          onSubmitEditing={() => passwordConfirmRef.current.focus()}
          placeholder="Password"
          returnKeyType="done"
          isPassword
        />
        <Input
          ref={passwordConfirmRef}
          label="Password Confrim"
          value={passwordConfirm}
          onChangeText={(text) => setPasswordConfirm(removeWhitespace(text))}
          onSubmitEditing={_handleSignupButton}
          placeholder="Password Confirm"
          returnKeyType="done"
          isPassword
        />

        <ErrorText>{errorMsg}</ErrorText>
        <Button
          title="SignUp"
          onPress={_handleSignupButton}
          disabled={disabled}
        />
      </Container>
    </KeyboardAwareScrollView>
  );
};

export default Signup;
