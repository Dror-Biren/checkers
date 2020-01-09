

const pieceDisplay = {
    NORMAL: "normal",
    //GLOW: "glow",
    INVISIBLE: "invisible",
    ON_CURSOR: "onCursur",
}

const preFixImgDisplay = {
    CUT: "cut-"
}

const pieceColorCode = {
    WHITE: 'w',
    BLACK: 'b'
}

const pieceTypeCode = {
    PAWN: "Pawn",
    KING: "King"
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

    get colorCode() {
        return this.isWhite ? pieceColorCode.WHITE : pieceColorCode.BLACK;
    }

    get typeCode() { 
        return this.isKing ? pieceTypeCode.KING : pieceTypeCode.PAWN;
    }

    get pieceCode() {
        return this.colorCode + this.typeCode;
    }

    get imageURL() {
        let url = imgsFolderName +'/';
        switch (this.display) {
            case pieceDisplay.INVISIBLE:
                return darkTileUrl;
            /* case pieceDisplay.GLOW:
                url += "glow-"; */
            case pieceDisplay.ON_CURSOR:
                url += preFixImgDisplay.CUT;
        }
        url += this.pieceCode + pieceImgsUrlSuffix;
        return url;
    }
}