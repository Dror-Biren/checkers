let board = [];
let clicked = { tile: null, prvTile: null };
let prvMovingPiece;

let isWhiteTurn;
let isFirstStepOfTurn;
let isGameOver;
let isBoardUpsideDown;
let isCapturePossible;
let isDoubleCapture;

let imgOnCursor;



const beginInPositionNum = 0;
const boardHeight = 8 , boardWidth = 8;
const whitePlayerName = "White player", blackPlayerName = "Black player";

const imgsUrl = {
    FOLDER_NAME: "Images/",
    DARK_TILE: "Images/dark-tile.jpg",
    LIGHT_TILE: "Images/light-tile.jpg",
    PIECE_DISPLAY: {
        CUT: "cut-",
        GLOW: "glow-"
    },
    PIECE_CODE: {
        WHITE_KING: 'wKing',
        WHITE_PAWN: 'wPawn',
        BLACK_KING: 'bKing',
        BLACK_PAWN: 'bPawn',
    },
    PIECE_SUFFIX: ".png",
}

const pieceDisplay = {
    NORMAL: "normal",
    GLOW: "glow",
    INVISIBLE: "invisible",
    ON_CURSOR: "onCursur",
}

const messages = {
    STARTING_PLAYER: ": you start!",
    ANNONCE_WINNING_PLAYER: " have won!",
    AFTER_WIN: "Congratulations.",
    POLITE_OPEN: "Please ",
    FIRST_STEP: "select a piece to move with",
    FIRST_STEP_WITH_CAPTURE: "select a piece to capture with",
    SECOND_STEP: "move to a destination tile",
    DOUBLE_CAPTURE: "capture again",
    ERROR: {
        INSTRUCTION: "- Please try again:",
        ALERT_START: "Error!\n",

        WRONG_COLOR_PIECE: "You can only move a piece in your color.",
        EMPTY_TILE: "This tile is empty.\n"
                    + "You need to choose a tile that contain a piece in your color.",
        OCCUPIED_TILE: "This tile is occupied. \n" +
                            "You need to move to an empty tile.",
        NOT_DIAGONALLY: "You can only move diagonally forward.",
        WRONG_VERTICAL: "You can't move that vertical distance.",
        WRONG_HORIZONTAL: "You can't move that horizontal distance.",
        MUST_CAPTURE: "When you can capture, you must capture."
    }
}


