import "./App.css";
import styled from "styled-components";
import React from "react";
import white_cross from "./white_cross.png";
import white_l from "./white_l.png";
import white_line from "./white_line.png";
import white_t from "./white_t.png";
import black_cross from "./black_cross.png";
import black_l from "./black_l.png";
import black_line from "./black_line.png";
import black_t from "./black_t.png";

const mapTypeToPiece = {
  white_cross: white_cross,
  white_l: white_l,
  white_line: white_line,
  white_t: white_t,
  black_cross: black_cross,
  black_l: black_l,
  black_line: black_line,
  black_t: black_t,
};

const Piece = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  height: 54px;
  width: 54px;
`;

const StyledBox = styled.div`
  position: relative;
  height: 54px;
  width: 54px;
  border: 3px solid black;
  display: inline-block;
  background-color: #024438;
`;

const StyledRow = styled.div`
  height: 60px;
`;

const StyledBoard = styled.div`
  margin: 20px auto;
  width: 540px;
  border: 3px solid black;
`;

const state = [
  [
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
  ],
  [
    { type: undefined },
    { type: undefined },
    { type: "white_l" },
    { type: "white_line" },
    { type: "white_t" },
    { type: "white_line" },
    { type: "white_l" },
    { type: undefined },
    { type: undefined },
  ],
  [
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: "white_cross" },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
  ],
  [
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
  ],
  [
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
  ],
  [
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
  ],
  [
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
  ],
  [
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
  ],
  [
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
  ],
  [
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
    { type: undefined },
  ],
];

const Box = ({ row, column }) => {
  const type = state[row][column].type;
  return (
    <StyledBox>
      {type ? <Piece src={mapTypeToPiece[type]} alt="" /> : undefined}
    </StyledBox>
  );
};

const Row = (props) => {
  return (
    <StyledRow>
      {props.row.map((cell, j) => (
        <Box cell={cell} column={j} row={props.i} />
      ))}
    </StyledRow>
  );
};

const Board = () => {
  const row = Array.from({ length: 9 });
  const table = Array.from({ length: 9 }).map(() => [...row]);

  return (
    <StyledBoard>
      {table.map((row, i) => (
        <Row row={row} i={i} />
      ))}
    </StyledBoard>
  );
};

function App() {
  return (
    <div className="App">
      <Board />
    </div>
  );
}

export default App;
