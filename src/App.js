import "./App.css";
import ReactDOM from "react-dom";
import { observable, set } from "mobx";
import { types, onSnapshot } from "mobx-state-tree";
import { UndoManager } from "mst-middlewares";
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
    isWhite: "",
  });
  mode = observable.box("POSICIONAR");
  inititialPosition = observable([]);
  grabbing = observable.box("");
  selected = observable([0, 0]);
  sendas = observable.box("");
  pieces = observable([
    { type: "white_l", id: "white_l_1", direction: 0, y: 2, x: 7 },
    { type: "white_line", id: "white_line_1", direction: 0, y: 3, x: 7 },
    { type: "white_t", id: "white_t", direction: 0, y: 4, x: 7 },
    { type: "white_line", id: "white_line_2", direction: 0, y: 5, x: 7 },
    { type: "white_l", id: "white_l_2", direction: 3, y: 6, x: 7 },
    { type: "white_cross", id: "white_cross", direction: 0, y: 4, x: 6 },
    { type: "black_l", id: "black_l_1", direction: 1, y: 2, x: 1 },
    { type: "black_line", id: "black_line_1", direction: 0, y: 3, x: 1 },
    { type: "black_t", id: "black_t", direction: 2, y: 4, x: 1 },
    { type: "black_line", id: "black_line_2", direction: 0, y: 5, x: 1 },
    { type: "black_l", id: "black_l_2", direction: 2, y: 6, x: 1 },
    { type: "black_cross", id: "black_cross", direction: 0, y: 4, x: 2 },
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
          isWhite: piece.type.includes("white"),
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

  setMode(mode) {
    this.mode.set(mode);

    if (mode === "MOVER") {
      this.inititialPosition.replace(JSON.parse(JSON.stringify(this.pieces)));
    }
  }

  reset() {
    if (this.inititialPosition.length > 0) {
      this.pieces.replace(this.inititialPosition);
    }
    set(this.lastMove, {
      from: {
        x: undefined,
        y: undefined,
      },
      to: {
        x: undefined,
        y: undefined,
      },
      isWhite: "",
    });
    this.sendas.set("");
  }
}
const boardState = observable.box(new BoardState()).get();

const PieceState = types
  .model({
    type: "",
    id: "",
    direction: 0,
    x: 0,
    y: 0,
  })
  .actions((self) => {
    return {
      rotate(dir) {
        self.direction = (self.direction - Math.pow(-1, dir)) % 4;
      },
    };
  });

const BoardStateTree = types
  .model({
    history: types.optional(UndoManager, {}),
    activeCell: types.array([4, 4]),
    grabbing: types.safeReference(PieceState),
    pieces: types.array(PieceState, [
      { type: "white_l", id: "white_l_1", direction: 0, y: 2, x: 7 },
      { type: "white_line", id: "white_line_1", direction: 0, y: 3, x: 7 },
      { type: "white_t", id: "white_t", direction: 0, y: 4, x: 7 },
      { type: "white_line", id: "white_line_2", direction: 0, y: 5, x: 7 },
      { type: "white_l", id: "white_l_2", direction: 3, y: 6, x: 7 },
      { type: "white_cross", id: "white_cross", direction: 0, y: 4, x: 6 },
      { type: "black_l", id: "black_l_1", direction: 1, y: 2, x: 1 },
      { type: "black_line", id: "black_line_1", direction: 0, y: 3, x: 1 },
      { type: "black_t", id: "black_t", direction: 2, y: 4, x: 1 },
      { type: "black_line", id: "black_line_2", direction: 0, y: 5, x: 1 },
      { type: "black_l", id: "black_l_2", direction: 2, y: 6, x: 1 },
      { type: "black_cross", id: "black_cross", direction: 0, y: 4, x: 2 },
    ]),
  })
  .actions((self) => {
    setUndoManager(self);
    return {
      afterCreate() {},
      grab() {
        const [x, y] = self.activeCell;
        if (self.grabbing) {
          self.grabbing.set(undefined);
          return;
        }
        const piece = self.pieces.find((p) => p.x === x && p.y === y);
        if (piece) {
          self.grabbing.set(PieceState);
        }
      },
      move(m, n) {
        const [x, y] = self.activeCell;
        self.activeCell.replace([x + m, y + n]);
        if (self.grabbing) {
          self.grabbing.x = x + m;
          self.grabbing.y = y + n;
        }
      },
      rotate(dir) {
        if (self.grabbing) {
          self.grabbing.rotate(dir);
        }
      },
    };
  });

export let undoManager = {};
export const setUndoManager = (targetStore) => {
  undoManager = targetStore.history;
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
  border: 3px solid
    ${(props) => (props.isTo ? `${props.movementColor}` : "black")};
  display: inline-block;
  background-color: ${(props) =>
    props.isFrom ? `${props.movementColor}` : "#024438"};
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

const SelectionBox = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: -3px;
  left: -3px;
  z-index: 2;
  ${(props) => props.isSelected && "border: 4px solid red"};
`;

const SendasBox = styled.div`
  opacity: 0.6;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  background-color: ${(props) => props.movementColor};
`;

const Box = observer((props) => {
  const row = props.row;
  const column = props.column;
  const piece = boardState.pieces.find((p) => p.x === row && p.y === column);
  const isSelected =
    boardState.selected[0] === row && boardState.selected[1] === column;
  const { x: fromX, y: fromY } = boardState.lastMove.from;
  const { x: toX, y: toY } = boardState.lastMove.to;
  const movementColor = boardState.lastMove.isWhite ? "red" : "green";
  const mode = boardState.mode.get();
  const isFrom = row === fromX && column === fromY && mode === "MOVER";
  const isTo = row === toX && column === toY && mode === "MOVER";
  const grabbedPiece = boardState.pieces.find(
    (p) => p.id === boardState.grabbing.get()
  );
  const isSendas = piece && boardState.sendas.get() === piece.id;
  return (
    <StyledBox
      onClick={() => boardState.select(row, column)}
      isFrom={isFrom}
      isTo={isTo}
      movementColor={movementColor}
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
      {isSendas && <SendasBox movementColor={movementColor} />}
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

const Radio = styled.input`
  margin-right: 30 px;
`;

const Ins = styled.div`
  font-size: 21px;
  text-align: left;
  margin-top: 30px;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
`;

const ActionItem = styled.div`
  margin: 20px 0;
`;

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
      event.preventDefault();

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
        case "Escape": {
          boardState.grabbing.set("");
          break;
        }
        case "s": {
          const grabbing = boardState.grabbing.get();
          if (grabbing) {
            boardState.sendas.set(grabbing);
            boardState.release();
            if (boardState.mode.get() === "MOVER") {
              this.handlePhoto();
            }
          }
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

    handleReset = () => {
      boardState.reset();
      this.setState({ movesList: [] });
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
        <div className="App">
          <Wrapper>
            <Board inneRef={this.boardRef} />
            <Actions>
              <ActionItem>
                <label htmlFor="posicionar">POSICIONAR</label>
                <Radio
                  id="posicionar"
                  type="radio"
                  name="mode"
                  value="POSICIONAR"
                  checked={boardState.mode.get() === "POSICIONAR"}
                  onChange={(e) => {
                    boardState.setMode(e.target.value);
                    this.boardRef.current.focus();
                  }}
                  tabIndex="-1"
                />
              </ActionItem>
              <ActionItem>
                <label htmlFor="mover">MOVER</label>
                <Radio
                  id="mover"
                  type="radio"
                  name="mode"
                  value="MOVER"
                  checked={boardState.mode.get() === "MOVER"}
                  onChange={(e) => {
                    boardState.setMode(e.target.value);
                    this.boardRef.current.focus();
                  }}
                  tabIndex="-1"
                />
              </ActionItem>
              <ActionItem>
                <button onClick={this.handleDownload}>Descargar</button>
              </ActionItem>
              <ActionItem>
                <button onClick={this.handleReset}>Reiniciar posicion</button>
              </ActionItem>
            </Actions>
            <Moves>
              {this.state.movesList.map((src) => (
                <SnapshotWrapper>
                  <Snapshot src={`${src}`} />
                </SnapshotWrapper>
              ))}
            </Moves>
            <div ref={this.portalRef} />
          </Wrapper>
          <Ins>
            Instrucciones:
            <ul>
              <li>Mover seleccion con flechas del teclado</li>
              <li>Enter para tomar una pieza</li>
              <li>R para girarla</li>
              <li>Enter para soltar la pieza</li>
              <li>Modo POSICIONAR permite posicionar la posicion inicial</li>
              <li>Modo MOVER genera una captura por cada movimiento</li>
              <li>
                Descargar: descarga todas las imagenes (se recomienda dentro de
                carpeta)
              </li>
            </ul>
          </Ins>
        </div>
      );
    }
  }
);

export default App;
