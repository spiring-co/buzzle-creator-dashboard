import React from "react";
import ContentLoader from "react-content-loader";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
const LoaderForm = styled.div`
  width: 100%;
  @media (max-width: 768px) {
    margin-top: 20%;
    margin-left: 5%;
    display: none;
  }
`;
const FormPlaceholder = () => {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  return (
    <div>
      <LoaderForm>
        <ContentLoader
          speed={2}
          width={1300}
          height={754}
          viewBox="0 0 1300 754"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
        >
          <rect x="189" y="62" rx="11" ry="11" width="835" height="673" />
        </ContentLoader>
      </LoaderForm>
      {isTabletOrMobile && (
        <ContentLoader
          speed={2}
          width={441}
          height={731}
          viewBox="0 0 441 731"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
        >
          <rect x="-9" y="30" rx="11" ry="11" width="464" height="625" />
        </ContentLoader>
      )}
    </div>
  );
};

export default FormPlaceholder;
