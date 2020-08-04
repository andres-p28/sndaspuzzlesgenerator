import styled from "styled-components";

const Piece = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  transform: rotate(${(props) => props.direction * 90}deg);
`;

export default Piece;
