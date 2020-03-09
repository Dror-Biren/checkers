class Tile {
    constructor(row, column, pieceOnTile) {
        this.row = row;
        this.column = column;
        this.pieceOnTile = pieceOnTile;
    }

    static getTileByPosition(row, column) {
        if (isBoardUpsideDown) {
            row = boardHeight - 1 - row;
            column = boardWidth / 2 - 1 - column;
        }
        return board[row][column];
    }

    enableAllTilesPointEventExceptThis() {
        for (let tile of board.flat()) {
            let pointEventStatus = (tile === this ? "none" : "auto");
            tile.htmlElement.style.pointerEvents = pointEventStatus;
        }
    }

    get htmlElement() {
        let displayRow = this.row, displayColumn = this.column;
        if (isBoardUpsideDown) {
            displayRow = boardHeight - 1 - displayRow;
            displayColumn = boardWidth / 2 - 1 - displayColumn;
        }
        return document.getElementById('' + displayRow + displayColumn);
    }

    get realColumnOfBoard() {
        return 2 * this.column + 1 - this.row % 2;
    }

    get isEmpty() {
        return this.pieceOnTile == null;
    }

    get imageURL() {
        if (this.isEmpty)
            return imgsUrl.DARK_TILE;
        return this.pieceOnTile.imageURL;

    }
}