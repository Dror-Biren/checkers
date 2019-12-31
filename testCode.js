var keepTrail = true;

var img = document.getElementById("followMouse");
img.style.display = "inline";
img.style.position = "absolute";
img.style.borderRadius = "100%";

document.addEventListener("mousemove", pieceDrag);
document.addEventListener("mousedown", changeImg);

function pieceDrag(event) {
  let {height,width} = img.getBoundingClientRect();
  img.style.top = (event.clientY - height / 2) + "px";
  img.style.left = (event.clientX - width / 2) + "px";
}

function changeImg(event)
{
    keepTrail = !keepTrail;
    //alert("a");
    img.src = keepTrail? "Images/cut-wPawn.png": "Images/cut-bPawn.png";
    img.style.display = keepTrail? "none" : "inline";

    pieceDrag(event);
}


