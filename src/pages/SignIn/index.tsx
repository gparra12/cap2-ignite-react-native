import React from "react";

import { RFValue } from "react-native-responsive-fontsize";

import AppleSvg from "../../assets/apple.svg";
import GoogleSvg from "../../assets/google.svg";
import LogoSvg from "../../assets/logo.svg";

import { SignInSocialButton } from "../../components/SignInSocialButton";

import {
  Container,
  Header,
  TitleWraper,
  Title,
  SigninTitle,
  Footer,
  FooterWrapper,
} from "./styles";

export function SignIn() {
  return (
    <Container>
      <Header>
        <TitleWraper>
          <LogoSvg width={RFValue(120)} height={RFValue(68)} />
          <Title>Controle suas finanças de forma {"\n"} muito simples</Title>
        </TitleWraper>

        <SigninTitle>
          Faça seu login com {"\n"} uma das contas abaixo
        </SigninTitle>
      </Header>
      <Footer>
        <FooterWrapper>
          <SignInSocialButton title="Entrar com Google" svg={GoogleSvg} />

          <SignInSocialButton title="Entrar com Apple" svg={AppleSvg} />
        </FooterWrapper>
      </Footer>
    </Container>
  );
}