import "./App.css";
import ReactDOM from "react-dom";
import { observable, set } from "mobx";
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
import html2canvas from "html2canvas";

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

class BoardState {
  lastMove = observable({
    from: {
      x: undefined,
      y: undefined,
    },
    to: {
      x: undefined,
      y: undefined,
    },
  });
  mode = observable.box("POSICIONAR");
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
    const id = this.grabbing.get();
    const piece = this.pieces.find((p) => p.id === id);

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
    let event;

    if (piece) {
      if (this.mode.get() === "MOVER") {
        event = {
          from: {
            x: piece.x,
            y: piece.y,
          },
          to: {
            x,
            y,
          },
        };
        set(this.lastMove, event);
      }
      piece.x = x;
      piece.y = y;
      this.grabbing.set("");
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
  border: 3px solid ${(props) => (props.isTo ? "red" : "black")};
  display: inline-block;
  background-color: ${(props) => (props.isFrom ? "red" : "#024438")};
`;

const StyledRow = styled.div`
  height: 60px;
`;

const StyledBoard = styled.div`
  width: 540px;
  height: 540px;
  border: 3px solid black;
  display: inline-block;
`;

const Moves = styled.div`
  border: 5px solid yellow;
  display: inline-block;
  width: 546px;
  text-align: left;
`;
const boardState = observable.box(new BoardState()).get();

const SelectionBox = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: -3px;
  left: -3px;
  z-index: 2;
  ${(props) => props.isSelected && "border: 4px solid red"};
`;

const Box = observer((props) => {
  const row = props.row;
  const column = props.column;
  const piece = boardState.pieces.find((p) => p.x === row && p.y === column);
  const isSelected =
    boardState.selected[0] === row && boardState.selected[1] === column;
  const { x: fromX, y: fromY } = boardState.lastMove.from;
  const { x: toX, y: toY } = boardState.lastMove.to;
  const mode = boardState.mode.get();
  const isFrom = row === fromX && column === fromY && mode === "MOVER";
  const isTo = row === toX && column === toY && mode === "MOVER";
  const grabbedPiece = boardState.pieces.find(
    (p) => p.id === boardState.grabbing.get()
  );

  return (
    <StyledBox
      onClick={() => boardState.select(row, column)}
      isFrom={isFrom}
      isTo={isTo}
    >
      <SelectionBox isSelected={isSelected} data-html2canvas-ignore />
      {piece && piece.id !== boardState.grabbing.get() && (
        <Piece
          src={mapTypeToPiece[piece.type]}
          direction={piece.direction}
          alt=""
        />
      )}
      {isSelected && grabbedPiece && (
        <Piece
          src={mapTypeToPiece[grabbedPiece.type]}
          direction={grabbedPiece.direction}
          alt=""
        />
      )}
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

const Board = observer((props) => {
  const row = Array.from({ length: 9 });
  const table = Array.from({ length: 9 }).map(() => [...row]);

  return (
    <StyledBoard id="board" ref={props.inneRef} tabIndex={0}>
      {table.map((row, i) => (
        <Row row={row} i={i} />
      ))}
    </StyledBoard>
  );
});

const SnapshotWrapper = styled.div`
  width: calc(33% - 2px);
  margin-right: 3px;
  &:nth-child(3n + 3) {
    margin-right: 0;
  }
  display: inline-block;
`;

const Snapshot = styled.img`
  width: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Radio = styled.input``;

const App = observer(
  class AppClass extends React.Component {
    constructor() {
      super();
      this.state = {
        movesList: [],
      };
      this.anchorRef = React.createRef();
      this.boardRef = React.createRef();
      this.portalRef = React.createRef();
    }
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
            boardState.release();
            if (boardState.mode.get() === "MOVER") {
              this.handlePhoto();
            }
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

    handlePhoto = () => {
      window.scrollTo(0, 0);
      html2canvas(this.boardRef.current).then((canvas) => {
        this.setState({
          movesList: [...this.state.movesList, canvas.toDataURL()],
        });
      });
    };

    handleDownload = () => {
      this.state.movesList.forEach((file, index) => {
        const anchor = React.createElement("a", {
          download: `move_${index}`,
          href: file,
          ref: this.anchorRef,
        });
        ReactDOM.render(anchor, this.portalRef.current);
        this.anchorRef.current.click();
        ReactDOM.unmountComponentAtNode(this.portalRef.current);
      });
    };

    render() {
      return (
        <Wrapper className="App">
          <Board inneRef={this.boardRef} />
          <label htmlFor="posicionar">POSICIONAR</label>
          <Radio
            id="posicionar"
            type="radio"
            name="mode"
            value="POSICIONAR"
            checked={boardState.mode.get() === "POSICIONAR"}
            onChange={(e) => {
              boardState.mode.set(e.target.value);
              this.boardRef.current.focus();
            }}
            tabIndex="-1"
          />
          <label htmlFor="mover">MOVER</label>
          <Radio
            id="mover"
            type="radio"
            name="mode"
            value="MOVER"
            checked={boardState.mode.get() === "MOVER"}
            onChange={(e) => {
              boardState.mode.set(e.target.value);
              this.boardRef.current.focus();
            }}
            tabIndex="-1"
          />
          <button onClick={this.handleDownload}>download</button>
          <Moves>
            {this.state.movesList.map((src) => (
              <SnapshotWrapper>
                <Snapshot src={`${src}`} />
              </SnapshotWrapper>
            ))}
          </Moves>
          <div ref={this.portalRef} />
        </Wrapper>
      );
    }
  }
);

export default App;
