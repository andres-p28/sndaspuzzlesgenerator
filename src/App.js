import "./App.css";
import { observable, toJS } from "mobx";
import { observer } from "mobx-react";
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
  transform: rotate(${(props) => props.direction * 90}deg);
`;

const StyledBox = styled.div`
  position: relative;
  height: 54px;
  width: 54px;
  border: 3px solid ${(props) => (props.isSelected ? "red" : "black")};
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

class BoardState {
  grabbing = observable.box("");
  selected = observable([0, 0]);
  pieces = observable([
    { type: "white_l", id: "white_l_1", direction: 1, y: 2, x: 1 },
    { type: "white_line", id: "white_line_1", direction: 0, y: 3, x: 1 },
    { type: "white_t", id: "white_t", direction: 2, y: 4, x: 1 },
    { type: "white_line", id: "white_line_2", direction: 0, y: 5, x: 1 },
    { type: "white_l", id: "white_l_2", direction: 2, y: 6, x: 1 },
    { type: "white_cross", id: "white_cross", direction: 0, y: 4, x: 2 },
    { type: "black_l", id: "black_l_1", direction: 0, y: 2, x: 7 },
    { type: "black_line", id: "black_line_1", direction: 0, y: 3, x: 7 },
    { type: "black_t", id: "black_t", direction: 0, y: 4, x: 7 },
    { type: "black_line", id: "black_line_2", direction: 0, y: 5, x: 7 },
    { type: "black_l", id: "black_l_2", direction: 3, y: 6, x: 7 },
    { type: "black_cross", id: "black_cross", direction: 0, y: 4, x: 6 },
  ]);

  rotate() {
    const [x, y] = this.selected;
    const piece = this.pieces.find((p) => p.x === x && p.y === y);

    if (piece) {
      piece.direction = (piece.direction + 1) % 4;
    }
  }

  grab() {
    const [x, y] = this.selected;
    const piece = this.pieces.find((p) => p.x === x && p.y === y);
    if (piece) {
      this.grabbing.set(piece.id);
    }
  }

  release() {
    const [x, y] = this.selected;
    const piece = this.pieces.find((p) => p.id === this.grabbing.get());
    if (piece) {
      piece.x = x;
      piece.y = y;
    }
  }

  select(x, y) {
    this.selected.replace([x, y]);
  }

  moveSelectUp() {
    this.selected[0] = Math.max(Math.min(this.selected[0] - 1, 8), 0);
  }

  moveSelectDown() {
    this.selected[0] = Math.max(Math.min(this.selected[0] + 1, 8), 0);
  }

  moveSelectLeft() {
    this.selected[1] = Math.max(Math.min(this.selected[1] - 1, 8), 0);
  }

  moveSelectRight() {
    this.selected[1] = Math.max(Math.min(this.selected[1] + 1, 8), 0);
  }
}

const boardState = observable.box(new BoardState()).get();

const Box = observer((props) => {
  const row = props.row;
  const column = props.column;
  const piece = boardState.pieces.find((p) => p.x === row && p.y === column);
  const isSelected =
    boardState.selected[0] === row && boardState.selected[1] === column;

  return (
    <StyledBox
      isSelected={isSelected}
      onClick={() => boardState.select(row, column)}
    >
      {piece ? (
        <Piece
          src={mapTypeToPiece[piece.type]}
          direction={piece.direction}
          alt=""
        />
      ) : undefined}
    </StyledBox>
  );
});

const Row = observer((props) => {
  return (
    <StyledRow>
      {props.row.map((cell, j) => (
        <Box cell={cell} column={j} row={props.i} />
      ))}
    </StyledRow>
  );
});

const Board = observer(() => {
  const row = Array.from({ length: 9 });
  const table = Array.from({ length: 9 }).map(() => [...row]);

  return (
    <StyledBoard>
      {table.map((row, i) => (
        <Row row={row} i={i} />
      ))}
    </StyledBoard>
  );
});

const App = observer(
  class AppClass extends React.Component {
    componentDidMount() {
      document.addEventListener("keydown", this.handleKeyDown);
    }
    handleKeyDown = (event) => {
      console.log(JSON.parse(JSON.stringify(boardState)));
      switch (event.key) {
        case "ArrowUp": {
          boardState.moveSelectUp();
          break;
        }
        case "ArrowDown": {
          boardState.moveSelectDown();
          break;
        }
        case "ArrowLeft": {
          boardState.moveSelectLeft();
          break;
        }
        case "ArrowRight": {
          boardState.moveSelectRight();
          break;
        }
        case " ": {
          if (!boardState.grabbing.get()) {
            boardState.grab();
          } else {
            console.log("rel");
            boardState.release();
          }
          break;
        }
        case "r": {
          boardState.rotate();
          break;
        }
        default:
          break;
      }
    };
    render() {
      return (
        <div className="App">
          <Board />
        </div>
      );
    }
  }
);

export default App;
