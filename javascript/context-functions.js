var start = Date.now(), doStroke = true;

// New context fuctions here.
function fill(red, green, blue, alpha) {
  if (alpha === undefined) {
    alpha = 1;
  }
  ctx.fillStyle = "rgba("+Math.floor(red)+","+Math.floor(green)+","+Math.floor(blue)+","+alpha+")";
}
function noStroke() {
  doStroke = false;
}
function stroke(red, green, blue) {
  ctx.strokeStyle = "rgb("+Math.floor(red)+","+Math.floor(green)+","+Math.floor(blue)+")";
  doStroke = true;
}
function strokeWeight(weight) {
  ctx.lineWidth = weight;
  doStroke = true;
}
function rect(x, y, width, height) {
  ctx.beginPath();
  ctx.rect(x - width/2, y - height/2, width, height);
  ctx.closePath();
  ctx.fill();
  if (doStroke) {
    ctx.stroke();
  }
}
function ellipse(x, y, xRadius, yRadius) {
  ctx.beginPath();
  ctx.ellipse(x, y, xRadius, yRadius, 0, 0, 2*Math.PI);
  ctx.closePath();
  ctx.fill();
  if (doStroke) {
    ctx.stroke();
  }
}
function line(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.closePath();
  ctx.stroke();
}
function geodesic(origin, destination, points, WIDTH, HEIGHT) {
  var lat = origin.latitude, lon = origin.longitude,
      deltaLat = (destination.latitude - origin.latitude) / points,
      deltaLon = (destination.longitude - origin.longitude) / points;
  for (var i = 0, a, b = convertCoords(lat, lon, WIDTH, HEIGHT); i < points; i++) {
    a = b;
    b = convertCoords(lat + deltaLat, lon + deltaLon, WIDTH, HEIGHT);
    line(a.x, a.y, b.x, b.y);
    lat += deltaLat;
    lon += deltaLon;
  }
}
function triangle(x1, y1, x2, y2, x3, y3) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  // Line to the from the first point to the second.
  ctx.lineTo(x2, y2);
  // Line to the from the second point to the third.
  ctx.lineTo(x3, y3);
  // Line to the from the third point to the first.
  ctx.lineTo(x1, y1);
  ctx.closePath();
  ctx.fill();
  if (doStroke) {
    ctx.stroke();
  }
}
function polygon(points) {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  // Do lines between each point.
  for (var i = 0; i < points.length; i++) {
    var point = points[(i + 1) % points.length]
    ctx.lineTo(point.x, point.y);
  }
  ctx.closePath();
  ctx.fill();
  if (doStroke) {
    ctx.stroke();
  }
}
function textSize(size) {
  ctx.font = size + "px Arial";
}
function text(str, x, y, alignment) {
  if (alignment === undefined) {
    alignment = "center";
  }
  ctx.textAlign = alignment;
  ctx.fillText(str, x, y);
}
function textWrap(str, x, y, width, fontSize) {
  // Idea adapted from https://codepen.io/ashblue/pen/fGkma?editors=0010
  
  var lines = [],
      line = "",
      lineTest = "",
      words = str.split(" "),
      currentY = y;
  
  textSize(fontSize);
  
  for (var i = 0, len = words.length; i < len; i++) {
    lineTest = line + words[i] + " ";
    
    if (ctx.measureText(lineTest).width < width) {
      line = lineTest;
    }
    else {
      currentY += fontSize;
      
      lines.push({"text": line, "currentY": currentY});
      line = words[i] + " ";
    }
  }
  
  // Catch last line in-case something is left over
  if (line.length > 0) {
    currentY += fontSize;
    lines.push({ "text": line.trim(), "currentY": currentY });
  }
  
  for (var i = 0, len = lines.length; i < len; i++) {
    text(lines[i]["text"], x, lines[i]["currentY"]);
  }
}
function image(path, x, y, width, height) {
  var img = new Image();
  img.onload = () => ctx.drawImage(img, x - width/2, y - height/2, width, height);
  img.src = path;
}

function millis() {
  return Date.now() - start;
}

// <GRAPH>
function graphFill(r, g, b) {
  graphCtx.strokeStyle = "rgba(" + r + ", " + g + ", " + b + ", 1)";
  graphCtx.fillStyle = "rgba(" + r + ", " + g + ", " + b + ", 1)";
}
function graphLine(x1, y1, x2, y2) {
  graphCtx.beginPath();
  graphCtx.moveTo(x1, y1);
  graphCtx.lineTo(x2, y2);
  graphCtx.closePath();
  graphCtx.stroke();
}
function graphEllipse(x, y, width, height) {
  graphCtx.beginPath();
  graphCtx.ellipse(x, y, width, height, 0, 0, 2*Math.PI);
  graphCtx.closePath();
  graphCtx.fill();
}
// </GRAPH>
