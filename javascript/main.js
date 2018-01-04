var canvas, ctx, WIDTH, HEIGHT, HALFWIDTH, HALFHEIGHT, ASPECTRATIO = 85/54; // aspectRatio is desired WIDTH/HEIGHT ratio.
var GC, graphCanvas, graphCtx;
var Input = {
  "37": false, // left arrow
  "38": false, // up arrow
  "39": false, // right arrow
  "40": false, // down arrow
  "32": false, // spacebar
  "click": false,
  "mousepos": {
    "x": 0,
    "y": 99999
  }
};

function resizeCSS() {
  // canvas css
  //canvas.style.marginLeft = (window.innerWidth - canvas.width)/2 + "px";
  //canvas.style.marginRight = (window.innerWidth - canvas.width)/2 + "px";
  //canvas.style.marginTop = canvas.height/40 + "px";
  // Panel css. Remember to account for padding (0.2vw) and borders (2px) in positioning. Borders should, however, overlap.
  /*var panel = document.getElementById("panel"),
      controlPanel = document.getElementById("control-panel"),
      infoPanel = document.getElementById("info-panel");
  panel.style.width = canvas.width + "px";
  controlPanel.style.left = (window.innerWidth - canvas.width)/2 + "px";
  controlPanel.style.width = (canvas.width/2 - 4/2 - 2*0.002*window.innerWidth) + "px"; // Subtract the border's width, not its double, so one border length overlaps.
  infoPanel.style.right = (window.innerWidth - canvas.width)/2 + "px";
  infoPanel.style.width = (canvas.width/2 - 4/2 - 2*0.002*window.innerWidth) + "px"; // Subtract the border's width, not its double, so one border length overlaps.
  // Remember to account for padding (0.2vw) and borders (2px) in bounding box.
  if (infoPanel.getBoundingClientRect().height > controlPanel.getBoundingClientRect().height) {
    controlPanel.style.height = (infoPanel.getBoundingClientRect().height - 4 - 2*0.002*window.innerWidth) + "px";
    infoPanel.style.height = (infoPanel.getBoundingClientRect().height - 4 - 2*0.002*window.innerWidth) + "px";
  }
  else {
    infoPanel.style.height = (controlPanel.getBoundingClientRect().height - 4 - 2*0.002*window.innerWidth) + "px";
    controlPanel.style.height = (controlPanel.getBoundingClientRect().height - 4 - 2*0.002*window.innerWidth) + "px";
  }
  // graph css
  var graph = document.getElementById("graph");
  graphCanvas.width = canvas.width;
  graphCanvas.height = HEIGHT / 3;
  graph.style.marginLeft = (window.innerWidth - graphCanvas.width)/2 + "px";
  graph.style.marginRight = (window.innerWidth - graphCanvas.width)/2 + "px";
  graph.style.marginTop = (graphCanvas.height/10 + infoPanel.getBoundingClientRect().height) + "px";*/
}

function resize() {
  ctx.translate(-HALFWIDTH, -HALFHEIGHT);
  
  canvas.width = 4/5 * window.innerWidth;
  canvas.height = canvas.width / ASPECTRATIO;
  if (canvas.height > 15/16 * window.innerHeight) {
    // If the height is greater than the height of the screen, set it accordingly.
    canvas.height = 15/16 * window.innerHeight;
    canvas.width = canvas.height * ASPECTRATIO;
  }
  
  resizeCSS();
  
  WIDTH = canvas.width;
  HEIGHT = canvas.height;
  HALFWIDTH = WIDTH / 2;
  HALFHEIGHT = HEIGHT / 2;
  
  GC.repositionCities();
  
  ctx.translate(HALFWIDTH, HALFHEIGHT);
}

function loop() {
  GC.update();
  
  Input.click = false;
  window.requestAnimationFrame(loop);
}

function init() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  graphCanvas = document.getElementById("graph-canvas");
  graphCtx = graphCanvas.getContext("2d");
  
  GC = new GameController();
  
  var body = document.getElementsByTagName("body")[0];
  body.onresize = resize;
  resize();
  window.setTimeout(resize, 100);
  
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  
  ctx.translate(HALFWIDTH, HALFHEIGHT);
  
  initInput(canvas);
  
  GC.initCities();
  window.setTimeout(GC.reset.bind(GC), 200);
  
  loop();
}

window.onload = init;
