import styled from "styled-components";
const BigButton = styled.button`
  width: fill-available;
  color: #ffffff;
  cursor: pointer;
  border: none;
  padding: 6px 0px;
  font-size: 18px;
  font-weight: 700;
  max-width: 500px;
  font-family: Poppins;
  border-radius: 5px;
  background-color: #4acb38;
`;

const RoundedButton = styled.button`
  padding: 0px 20px 0px 20px;
  min-width: 70px;
  height: 50px;
  border-radius: 25px;
  font-weight: 700;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  background: #1e90ff;
  color: white;
  -webkit-appearance: none;
  border: none;
  font-size: 16px;
  font-family: Poppins;
`;
export { BigButton, RoundedButton };
