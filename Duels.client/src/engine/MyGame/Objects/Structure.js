function Structure(spriteTexture, normalMap, atX, atY, coX, coY, num, team, type, sieged) {
  if (normalMap !== null) {
    this.structure = new IllumRenderable(spriteTexture, normalMap);
  } else {
    this.structure = new LightRenderable(spriteTexture);
  }

  this.team = team;
  this.type = type;
  this.pp = [0, 0, 0, 0];

  if (this.team == 1) {
    this.pp[0] = 0;
    this.pp[1] = 32;
  } else if (this.team == 2) {
    this.pp[0] = 33;
    this.pp[1] = 65
  }

  if (this.type == "humanBase") {
    this.pp[2] = 65;
    this.pp[3] = 97;
  }

  this.structure.setColor([1, 1, 1, 0]);
  this.structure.getXform().setPosition(atX, atY);
  this.structure.getXform().setSize(5.3, 5.3);
  this.structure.setElementPixelPositions(this.pp[0], this.pp[1], this.pp[2], this.pp[3]);
  this.coX = coX;
  this.coY = coY;
  this.num = num;
  this.sieged = sieged || false;

  GameObject.call(this, this.structure);
}
gEngine.Core.inheritPrototype(Structure, GameObject);

Structure.prototype.selectStructure = function () {
  this.structure.getXform().setSize(5.8, 5.8)
}

Structure.prototype.unselectStructure = function () {
  this.structure.getXform().setSize(5.3, 5.3)
}