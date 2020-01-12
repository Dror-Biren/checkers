
class Piece {
    constructor(isWhite, isKing = false, display = pieceDisplay.NORMAL) {
        this.isWhite = isWhite;
        this.isKing = isKing;
        this.display = display;
    }

    copyPieceWithNewDisplay(newDisplay) {
        return new Piece(this.isWhite, this.isKing, newDisplay);
    }

    get pieceCode() {
        if (this.isWhite) {
            if (this.isKing)
                return imgsUrl.PIECE_CODE.WHITE_KING;
            return imgsUrl.PIECE_CODE.WHITE_PAWN;
        }
        if (this.isKing)
            return imgsUrl.PIECE_CODE.BLACK_KING;
        return imgsUrl.PIECE_CODE.BLACK_PAWN;
    }

    get imageURL() {
        let url = imgsUrl.FOLDER_NAME;
        switch (this.display) {
            case pieceDisplay.INVISIBLE:
                return imgsUrl.DARK_TILE;
            case pieceDisplay.GLOW:
                url += imgsUrl.PIECE_DISPLAY.GLOW;
                break;
            case pieceDisplay.ON_CURSOR:
                url += imgsUrl.PIECE_DISPLAY.CUT;
        }
        url += this.pieceCode + imgsUrl.PIECE_SUFFIX;
        return url;
    }
}