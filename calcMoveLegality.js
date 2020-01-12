let CalcMoveLegality = {};

CalcMoveLegality.getFirstStepMoveLegality = function (hypothClicked = clicked) {
    if (!hypothClicked.tile.pieceOnTile)
        return new IllegalMove(messages.ERROR.EMPTY_TILE);
    if (hypothClicked.tile.pieceOnTile.isWhite !== isWhiteTurn)
        return new IllegalMove(messages.ERROR.WRONG_COLOR_PIECE);
    return new LegalFirstStepMove();
}

CalcMoveLegality.getSecondStepMoveLegality = function (hypothClicked = clicked) {
    if (hypothClicked.tile.pieceOnTile)
        return new IllegalMove(messages.ERROR.OCCUPIED_TILE);
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
        return new IllegalMove(messages.ERROR.NOT_DIAGONALLY);
    if (deltaRow !== 1 && deltaRow !== 2)
        return new IllegalMove(messages.ERROR.WRONG_VERTICAL);
    if (deltaColumn !== 1 && deltaColumn !== 2)
        return new IllegalMove(messages.ERROR.WRONG_HORIZONTAL);

    if (deltaRow === 2)
        return CalcMoveLegality.getAttemptCaptureLegality(hypothClicked);

    if (isCapturePossible)
        return new IllegalMove(messages.ERROR.MUST_CAPTURE);

    return new LegalSecondStepMove(null);
}

CalcMoveLegality.getAttemptCaptureLegality = function (hypothClicked) {
    let tileBetween = CalcMoveLegality.getTileBetweenTiles(hypothClicked.tile, hypothClicked.prvTile);
    if (tileBetween.isEmpty || isWhiteTurn === tileBetween.pieceOnTile.isWhite)
        return new IllegalMove(messages.ERROR.WRONG_VERTICAL);

    return new LegalSecondStepMove(tileBetween);
}

CalcMoveLegality.getTileBetweenTiles = function (tile1, tile2) {
    const floorAvrg = (a, b) => Math.floor((a + b) / 2);
    let row = floorAvrg(tile1.row, tile2.row);
    let column = floorAvrg(tile1.column, tile2.column) + row % 2;
    return board[row][column];
}