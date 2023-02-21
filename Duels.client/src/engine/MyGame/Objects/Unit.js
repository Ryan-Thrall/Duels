function Unit(spriteTexture, normalMap, atX, atY, ppX, coX, coY) {
  if (normalMap !== null) {
    this.unit = new IllumRenderable(spriteTexture, normalMap);
  } else {
    this.unit = new LightRenderable(spriteTexture);
  }
  this.unit.setColor([1, 1, 1, 0]);
  this.unit.getXform().setPosition(atX, atY);
  this.unit.getXform().setSize(3.5, 3.5);
  this.unit.setElementPixelPositions(ppX, ppX + 32, 65, 97);
  this.unit.coX = coX;
  this.unit.coY = coY;
  GameObject.call(this, this.unit);
}
gEngine.Core.inheritPrototype(Unit, GameObject);