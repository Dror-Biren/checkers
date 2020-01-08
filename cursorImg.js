let CursorImg = {};

CursorImg.imgOnCursor;
CursorImg.imgOnCursorSize = { height: 0, width: 0};

CursorImg.resetImgOnCursor = function () {
    //imgOnCursor = document.getElementById("board").querySelector("#imgOnCursor");
    imgOnCursor = document.getElementById("imgOnCursor");
    imgOnCursor.style.position = "absolute";
    imgOnCursor.style.borderRadius = "100%";
    imgOnCursor.style.visibility = "hidden";
    imgOnCursor.style.pointerEvents = "none";
    document.addEventListener("mousemove", setImgPositionToCursor);
    document.addEventListener("mousedown", setImgPositionToCursor);
}

CursorImg.setImgPositionToCursor = function (event) {
    imgOnCursor.style.top = (event.clientY - imgOnCursorSize.height / 2) + "px";
    imgOnCursor.style.left = (event.clientX - imgOnCursorSize.width / 2) + "px";
}

CursorImg.updateImgOnCursorSize = function ()
{
    imgOnCursor.style.height = imgOnCursor.style.width = board[0][0].htmlElement.offsetWidth+"px";
    ({width: imgOnCursorSize.width, height: imgOnCursorSize.height } = imgOnCursor.getBoundingClientRect());
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
    updateImgOnCursorSize();      
}