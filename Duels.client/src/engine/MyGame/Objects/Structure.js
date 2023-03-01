function Structure(spriteTexture, normalMap, atX, atY, pp, coX, coY, team, type) {
  if (normalMap !== null) {
    this.structure = new IllumRenderable(spriteTexture, normalMap);
  } else {
    this.structure = new LightRenderable(spriteTexture);
  }
  this.structure.setColor([1, 1, 1, 0]);
  this.structure.getXform().setPosition(atX, atY);
  this.structure.getXform().setSize(5.3, 5.3);
  this.structure.setElementPixelPositions(pp[0], pp[1], pp[2], pp[3]);
  this.coX = coX;
  this.coY = coY;
  this.team = team;
  this.type = type;
  GameObject.call(this, this.structure);
}
gEngine.Core.inheritPrototype(Structure, GameObject);

Structure.prototype.selectStructure = function () {
  this.structure.getXform().setSize(5.8, 5.8)
}

Structure.prototype.unselectStructure = function () {
  this.structure.getXform().setSize(5.3, 5.3)
}