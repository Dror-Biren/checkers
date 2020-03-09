let CursorImg = {};

CursorImg.resetImgOnCursor = function () {
    //imgOnCursor = document.getElementById("board").querySelector("#imgOnCursor");
    imgOnCursor = document.getElementById("imgOnCursor");
    imgOnCursor.style.position = "absolute";
    imgOnCursor.style.borderRadius = "100%";
    imgOnCursor.style.visibility = "hidden";
    imgOnCursor.style.pointerEvents = "none";
    document.addEventListener("mousemove", CursorImg.setImgPositionToCursor);
    document.addEventListener("mousedown", CursorImg.setImgPositionToCursor);
}

CursorImg.setImgPositionToCursor = function (event) {
    let imgOnCursorSize = board[0][0].htmlElement.offsetWidth;
    imgOnCursor.style.top = (event.clientY - imgOnCursorSize / 2) + "px";
    imgOnCursor.style.left = (event.clientX - imgOnCursorSize / 2) + "px";
}

CursorImg.setImgOnCursorToTileContent = function(tile) {
    //console.log("change cursor img");
    if (tile.isEmpty)
    {
        imgOnCursor.style.visibility = "hidden";
        return;
    }
    let pieceOnCursor = tile.pieceOnTile.copyPieceWithNewDisplay(pieceDisplay.ON_CURSOR);
    imgOnCursor.src = pieceOnCursor.imageURL;
    imgOnCursor.style.visibility = "visible";
    imgOnCursor.style.height = imgOnCursor.style.width = board[0][0].htmlElement.offsetWidth+"px";     
}