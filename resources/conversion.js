// Gall-Peters projection conversion
function convertCoords(latitude, longitude, WIDTH, HEIGHT) {
  // Subtract 11.25 degrees of longitude to correct for the Gall-Peters projection's centering on the Florence Meridian instead of the Greenwich Meridian.
  return new Vector2D(WIDTH/2 * (longitude - 11.25) / 180, -HEIGHT/2 * Math.sin(latitude * Math.PI/180));
}
