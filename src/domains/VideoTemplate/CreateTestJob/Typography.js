import Colors from "./constants/Colours";
import styled from "styled-components";

const HeaderText = styled.p`
  margin-top: 10px;
  margin-bottom: 5px;
  font-size: 18px;
  font-family: Poppins;
  font-weight: 600;
  color: ${Colors.primaryTextColor};
`;

const BodyText = styled.p`
  margin-bottom: 10px;
  font-size: 14px;
  font-family: Poppins;
  text-align: left;
  color: ${Colors.secondaryTextColor};
`;

const TitleText = styled.p`
  margin-bottom: 15px;
  margin-top: 5px;
  font-size: 30px;
  font-weight: 700;
  font-family: Poppins;
  color: ${Colors.primaryTextColor};
`;

export { HeaderText, TitleText, BodyText };
