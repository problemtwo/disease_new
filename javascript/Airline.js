class Airline {
  
  constructor(city) {
    this.city = city;
    this.flightProbabilities = [];
    this.infectedRejectionRate = 0.1; // Fraction of infected passengers rejected and forced to miss their flight.
  }
  
  distanceTo(otherCity) {
    // Credit to https://www.movable-type.co.uk/scripts/latlong.html
    var R = 6371e3; // metres
    var lat1 = this.city.latitude * Math.PI/180;
    var lat2 = otherCity.latitude * Math.PI/180;
    var latDiff = (lat2-lat1);
    var lonDiff = (otherCity.longitude - this.city.longitude) * Math.PI/180;

    var a = Math.sin(latDiff/2) * Math.sin(latDiff/2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(lonDiff/2) * Math.sin(lonDiff/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }
  
  calculateFlightProbabilities() {
    // Choose closer cities with higher populations more frequently.
    var total = 0, distance, i;
    GC.cities.forEach(city => {
      if (city !== this.city) {
        distance = this.distanceTo(city);
        if (distance < 17395000) { // longest commercial aircraft range
          total += city.population / distance * (city.country == this.city.country ? 0.875 : 0.125); // Domestic flights comprise about 7/8 of all air travel.
          this.flightProbabilities.push([city, total]);
        }
      }
    });
    this.flightProbabilities.forEach(cityChancePair => cityChancePair[1] /= total);
  }
  
  findFlight() {
    if (this.flightProbabilities.length == 0) // One-time calculation
      this.calculateFlightProbabilities();
    
    for (var i = 0, cityIndex = Math.random(); ; i++)
      if (this.flightProbabilities[i][1] >= cityIndex)
        return GC.cities[i];
  }
  
}
