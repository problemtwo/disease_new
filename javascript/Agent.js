class Agent {
  
  constructor(pos, city) {
    this.pos = pos;
    this.size = WIDTH / 400;
    
    this.city = city;
    
    this.healthy = true;
    this.recovered = false; // true if successfully recovered
    this.timeSick = 0;
    this.timeRecovered = 0;
    this.infectiousness = 0.004; // fraction of agents infected from sick agent
    this.deadlyness = 0.002; // per day chance of death for infected agents
    this.recoveryProtection = 0.8; // Relative chance of becoming infected for recovered agents. 0.2 means, for example, that when 10 regular agents would get infected, only 2 recovered agents would.
    this.daysToMaximumRecoveryChance = 5; // Days after infection until recovery is most likely.
    this.maximumRecoveryChance = 1/20; // Likelyhood per frame of recovery at the maximum.
    this.recoveredRecoveryFactor = 1.4; // Scalar from 0 to n that signifies how much better recovered agents re-recover (0 means they don't; 2 means they re-recover at 2x efficiency).
    this.recoveredDeathFactor = 0.8; // Scalar from 0 to 1 that signifies how much less likely recovered agents are to die from infection.
    this.recoveredDays = 80; // (1-n) How many days before recovered state is over and agents no longer maintain the benefits against the disease.
  }
  
  display() {
    if (!this.healthy) // unhealthy => red
      fill(200, 0, 0);
    else if (!this.recovered) // healthy but not immune => green
      fill(0, 200, 0);
    else // healthy and immume => blue
      fill(0, 0, 200);
    noStroke();
    ellipse(this.pos.x + (Math.random() - 0.5) * this.city.radius/2, this.pos.y + (Math.random() - 0.5) * this.city.radius/2, this.size, this.size);
  }
  
  infect() {
    if (this.healthy)
      return;
    // Not healthy: every agent in the city has a chance of getting infected.
    this.city.agents.forEach(agent => {
      if (Math.random() < this.infectiousness * (this.recovered ? this.recoveryProtection : 1) && !agent.infected) {
        agent.healthy = false;
        fill(200, 0, 0);
        ellipse(agent.pos.x, agent.pos.y, agent.size * 1.5, agent.size * 1.5);
      }
    }, this);
  }
  
  recover() {
    if (this.healthy) {
      if (this.recovered) {
        this.timeRecovered++;
        if (this.timeRecovered > this.recoveredDays)
          this.recovered = false;
      }
      return;
    }
    // Agents' chance of recovery per frame follows the curve 1 / (a + e^(b-t)), where t = this.timeSick.
    if (Math.random() < 1 / (1/this.maximumRecoveryChance + Math.exp(this.daysToMaximumRecoveryChance-this.timeSick)) * (this.recovered ? this.recoveredRecoveryFactor : 1)) { // Recovery.
        this.healthy = true;
        this.recovered = true; // Assume a recovered agent has the antibodies to not become infected again.
        this.timeRecovered = 0;
        this.timeSick = 0;
    }
    if (Math.random() < this.deadlyness * (this.recovered ? this.recoveredDeathFactor : 1)) { // Death: remove from city agents list.
      this.city.agents.splice(this.city.agents.indexOf(this), 1);
    }
    this.timeSick++;
  }
  
  fly(destination) {
    if (!this.healthy && Math.random() < this.city.airline.infectedRejectionRate) {
      this.flightData = undefined;
      return;
    }
//     stroke(100, 100, 100);
//     geodesic(this.city, destination, 20, WIDTH, HEIGHT);

    this.city.agents.splice(this.city.agents.indexOf(this), 1);
    this.city = destination;
    this.pos = this.city.pos;
    this.city.agents.push(this);
  }
  
  travel() {
    if (this.flightData) {
      this.flightData.daysUntilReturn--;
      if (this.flightData.daysUntilReturn == 0) {
        this.fly(this.flightData.origin);
        this.flightData = undefined;
      }
    }
    else if (Math.random() < 0.01) {
      this.flightData = {"moving": Math.random() < 0.05, "destination": this.city.airline.findFlight(), "origin": this.city};
      if (this.flightData.destination) { // A flight is available
        this.fly(this.flightData.destination);
        
        if (this.flightData !== undefined) {
          if (!this.flightData.moving) { // If not moving, fly back home after 1 - 27 days.
            this.flightData.daysUntilReturn = Math.floor( Math.pow(5, 4*Math.random() - 2) + 2);
          }
        }
      }
      else { // No flights available: reset and retry.
        this.flightData = undefined;
      }
    }
  }
  
  update() {
    this.travel();
    this.infect();
    this.recover();
  }
  
}
