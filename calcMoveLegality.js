let CalcMoveLegality = {};

CalcMoveLegality.getFirstStepMoveLegality = function (hypothClicked = clicked) {
    if (!hypothClicked.tile.pieceOnTile)
        return new IllegalMove("This tile is empty." +
            "\nYou need to choose a tile that contain a piece in your color.");
    if (hypothClicked.tile.pieceOnTile.isWhite !== isWhiteTurn)
        return new IllegalMove("You can only move a piece in your color.");
    return new LegalFirstStepMove();
}

CalcMoveLegality.getSecondStepMoveLegality = function (hypothClicked = clicked) {
    if (hypothClicked.tile.pieceOnTile)
        return new IllegalMove("This tile is occupied. \n" +
            "You need to move to an empty tile.");
    let deltaColumn = Math.abs(hypothClicked.tile.realColumnOfBoard - hypothClicked.prvTile.realColumnOfBoard);
    var deltaRow;
    setDeltaRow();
    function setDeltaRow() {
        deltaRow = hypothClicked.tile.row - hypothClicked.prvTile.row;
        if (isWhiteTurn)
            deltaRow = -deltaRow;
        if (hypothClicked.prvTile.pieceOnTile.isKing)
            deltaRow = Math.abs(deltaRow);
    }
    if (deltaRow != deltaColumn)
        return new IllegalMove("You can only move diagonally forward.");
    if (deltaRow !== 1 && deltaRow !== 2)
        return new IllegalMove("You can't move that vertical distance.");
    if (deltaColumn !== 1 && deltaColumn !== 2)
        return new IllegalMove("You can't move that horizontal distance.");

    if (deltaRow === 2)
        return CalcMoveLegality.getAttemptCaptureLegality(hypothClicked);

    if (isCapturePossible)
        return new IllegalMove("When you can capture, you must capture.");

    return new LegalSecondStepMove(null);
}

CalcMoveLegality.getAttemptCaptureLegality = function (hypothClicked) {
    let tileBetween = CalcMoveLegality.getTileBetweenTiles(hypothClicked.tile, hypothClicked.prvTile);
    if (tileBetween.isEmpty)
        return new IllegalMove("You can't move a double move unless you capture.");
    if (isWhiteTurn === tileBetween.pieceOnTile.isWhite)
        return new IllegalMove("You can capture only a piece of your color.");

    return new LegalSecondStepMove(tileBetween);
}

CalcMoveLegality.getTileBetweenTiles = function (tile1, tile2) {
    const floorAvrg = (a, b) => Math.floor((a + b) / 2);
    let row = floorAvrg(tile1.row, tile2.row);
    let column = floorAvrg(tile1.column, tile2.column) + row % 2;
    return board[row][column];
}