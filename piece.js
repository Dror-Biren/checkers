

const pieceDisplay = {
    NORMAL: "normal",
    //GLOW: "glow",
    INVISIBLE: "invisible",
    ON_CURSOR: "onCursur",
}

class Piece {
    constructor(isWhite, isKing = false, display = pieceDisplay.NORMAL) {
        this.isWhite = isWhite;
        this.isKing = isKing;
        this.display = display;
    }

    copyPieceWithNewDisplay(newDisplay) {
        return new Piece(this.isWhite, this.isKing, newDisplay);
    }

    get imageURL() {
        let url = "Images/";
        switch (this.display) {
            case pieceDisplay.INVISIBLE:
                return "Images/dark-tile.jpg";
            /* case pieceDisplay.GLOW:
                url += "glow-"; */
            case pieceDisplay.ON_CURSOR:
                url += "cut-";
        }

        let pieceType = this.isWhite ? 'w' : 'b';
        if (this.isKing)
            pieceType = pieceType.toUpperCase() + "King";
        else
            pieceType += "Pawn";

        url += pieceType + ".png";
        return url;
    }
}