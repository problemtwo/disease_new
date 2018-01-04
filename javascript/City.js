class City {
  
  constructor(name, latitude, longitude, population, country) {
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
    this.pos = convertCoords(latitude, longitude, WIDTH, HEIGHT);
    this.population = population;
    this.country = country;
    this.radius = WIDTH/1200 * (Math.log(population) - 11);
    this.radiusSquared = this.radius*this.radius;
    this.airline = new Airline(this);
    this.agents = [];
  }
  
  initAgents() {
    this.agentNum = Math.ceil((this.population / GC.WORLDPOPULATION) * GC.agentNum);
    var pos = convertCoords(this.latitude, this.longitude, WIDTH, HEIGHT);
    for (var i = 0; i < this.agentNum; i++) {
      this.agents.push(new Agent(pos, this));
    }
  }
  
  mouseInteraction() {
    // If the mouse is over a city, display additional information.
    var distSquared = Math.pow(this.pos.x - Input.mousepos.x, 2) + Math.pow(this.pos.y - Input.mousepos.y, 2);
    if (distSquared > this.radiusSquared)
      return;
    
    this.infoCard();
    
    if (Input.click) { // If a city is clicked, an infected agent is pushed in.
      this.agents.push(new Agent(this.pos, this));
      this.agents[this.agents.length - 1].healthy = false;
      GC.AGENTPOPULATION++;
    }
  }
  
  infoCard() {
    ctx.save();
    if (this.pos.y + this.radius > 0)
      ctx.translate(0, -HEIGHT*0.31 - 4*this.radius);
    fill(0, 0, 0, 0.6);
    rect(this.pos.x, this.pos.y + 2*this.radius + HEIGHT*0.1505, WIDTH/4, HEIGHT*0.31);
    fill(255, 255, 255);
    textSize(HEIGHT/28);
    text("-" + this.name + "-", this.pos.x, this.pos.y + 2*this.radius + 1.2*HEIGHT/30);
    textSize(HEIGHT/30);
    text("country: " + this.country, this.pos.x, this.pos.y + 2*this.radius + 2.5*HEIGHT/30);
    text("population: " + this.population, this.pos.x, this.pos.y + 2*this.radius + 3.5*HEIGHT/30);
    text("latitude: " + Math.floor(this.latitude * 1000) / 1000, this.pos.x, this.pos.y + 2*this.radius + 4.5*HEIGHT/30);
    text("longitude: " + Math.floor(this.longitude * 1000) / 1000, this.pos.x, this.pos.y + 2*this.radius + 5.5*HEIGHT/30);
    text("agents: " + this.agents.length, this.pos.x, this.pos.y + 2*this.radius + 6.8*HEIGHT/30);
    text("infected: " + this.agents.reduce((infected, agent) => infected + (!agent.healthy ? 1 : 0), 0), this.pos.x, this.pos.y + 2*this.radius + 7.8*HEIGHT/30);
    text("recovered: " + this.agents.reduce((recovered, agent) => recovered + (agent.recovered ? 1 : 0), 0), this.pos.x, this.pos.y + 2*this.radius + 8.8*HEIGHT/30);
    ctx.restore();
  }
  
  display() {
//     fill(200, 200, 0);
//     ellipse(this.pos.x, this.pos.y, this.radius, this.radius);
    this.agents.forEach(agent => agent.display());
  }
  
  reposition() {
    this.pos = convertCoords(this.latitude, this.longitude, WIDTH, HEIGHT);
    this.radius = WIDTH/1200 * (Math.log(this.population) - 11);
    this.radiusSquared = this.radius*this.radius;
  }
  
  update() {
    this.agents.forEach(agent => agent.update());
  }
  
}
