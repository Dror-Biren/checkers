
let client
let opponent
let isClientWhite = true;
const isClientTurn = () => isClientWhite === isWhiteTurn;

let board = [];
let clicked = { tile: null, prvTile: null };
let prvMovingPiece;

let isWhiteTurn;
let isFirstStepOfTurn;
let isGameStart;
let isGameOver;
let isBoardUpsideDown;
let isCapturePossible;
let isDoubleCapture;

let imgOnCursor;



const beginInPositionNum = 3;
const boardHeight = 8 , boardWidth = 8;

const imgsUrl = {
    FOLDER_NAME: "../Images/",
    DARK_TILE: "../Images/dark-tile.jpg",
    LIGHT_TILE: "../Images/light-tile.jpg",
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
    BEFORE_GAME: "Waiting for a match",
    BEFORE_GAME_SUB: (dotsAmount) => "looking for user who wants to play" +".".repeat(dotsAmount),
    STARTING_WHITE: "You got the white pieces",
    STARTING_BLACK: "You got the black pieces",
    WIN: "You have won!",
    WIN_SUB: "Congratulations.",
    WIN_TECHNICALY: "You have won! (technicaly)",
    WIN_TECHNICALY_SUB: "your opponent has left the game",
    LOSE: "You have lost!",
    LOSE_SUB: "Sorry...",

    OPPONENT_TURN: "Opponent turn",
    OPPONENT_TURN_SUB: (dotsAmount) => "waiting for opponent" + ".".repeat(dotsAmount),
    CLIENT_TURN: "Your turn",
    POLITE_OPEN: "Please ",
    FIRST_STEP: "select a piece to move with",
    FIRST_STEP_WITH_CAPTURE: "select a piece to capture with",
    SECOND_STEP: "move to a destination tile",
    DOUBLE_CAPTURE: "capture again",
    ERROR: {
        INSTRUCTION: "- Please try again:",
        ALERT_START: "Error!\n",

        OPENING_PARALLEL_GAMES: "You can't open multiple games in parallel",
        NOT_CLIENT_TURN: "Wait... It's not your turn yet.",
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


