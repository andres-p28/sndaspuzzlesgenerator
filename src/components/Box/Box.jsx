import React from "react";
import styled from "stul";

const StyledBox = styled.div`
  position: relative;
  height: 54px;
  width: 54px;
  border: 3px solid
    ${(props) => (props.isTo ? `${props.movementColor}` : "black")};
  display: inline-block;
  background-color: ${(props) =>
    props.isFrom ? `${props.movementColor}` : "#024438"};
`;

const Box = () => {
  return <div></div>;
};

export default Box;
