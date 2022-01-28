import { RFValue, RFPercentage } from "react-native-responsive-fontsize";
import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  width: 100%;
  height: 70%;

  justify-content: flex-end;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.primary};
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: ${RFValue(30)}px;
  color: ${({ theme }) => theme.colors.shape};
  text-align: center;

  margin: 40px;
`;

export const TitleWraper = styled.View`
  align-items: center;
`;

export const SigninTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(16)}px;
  color: ${({ theme }) => theme.colors.shape};
  text-align: center;

  margin-bottom: 80px;
`;
export const Footer = styled.View`
  width: 100%;
  height: 30%;

  background-color: ${({ theme }) => theme.colors.secondary};
`;

export const FooterWrapper = styled.View`
  margin-top: ${RFPercentage(-4)}px;
  padding: 0 32px;

  justify-content: space-between;
`;
