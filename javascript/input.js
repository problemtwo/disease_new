function initInput(canvas) {
  window.onkeydown = function(e) {
    if (Input[e.keyCode] !== undefined) {
      Input[e.keyCode] = true;
    }
  };
  window.onkeyup = function(e) {
    if (Input[e.keyCode] !== undefined) {
      Input[e.keyCode] = false;
    }
  };
  canvas.onmouseup = function(e) {
    Input["click"] = true;
  };
  document.onmousemove = function(e) {
    var x = e.clientX - window.innerWidth/2;

    var y = e.clientY - HALFHEIGHT - HEIGHT/40;
    Input["mousepos"]["x"] = x;
    Input["mousepos"]["y"] = y;
  };
}
