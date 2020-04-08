import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  margin: auto;
  margin-bottom: 0px;
  margin-top: 30px;
  @media only screen and (min-width: 768px) {
    width: 65%;
  }
`;

const Section = styled.div`
  padding: 20px;
`;

export { Container, Section };
