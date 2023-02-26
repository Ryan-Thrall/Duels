function Unit(spriteTexture, normalMap, atX, atY, pp, coX, coY, team, type) {
  if (normalMap !== null) {
    this.unit = new IllumRenderable(spriteTexture, normalMap);
  } else {
    this.unit = new LightRenderable(spriteTexture);
  }
  this.unit.setColor([1, 1, 1, 0]);
  this.unit.getXform().setPosition(atX, atY);
  this.unit.getXform().setSize(5, 5);
  this.unit.setElementPixelPositions(pp[0], pp[1], pp[2], pp[3]);//65 97
  this.coX = coX;
  this.coY = coY;
  this.team = team;
  this.type = type;
  GameObject.call(this, this.unit);
}
gEngine.Core.inheritPrototype(Unit, GameObject);

Unit.prototype.selectUnit = function () {
  this.unit.getXform().setSize(6, 6);
}

Unit.prototype.updateCoords = function (coX, coY) {
  this.coX = coX;
  this.coY = coY;
}