

function Tile(spriteTexture, normalMap, atX, atY, pp, coX, coY) {
  if (normalMap !== null) {
    this.tile = new IllumRenderable(spriteTexture, normalMap);
  } else {
    this.tile = new LightRenderable(spriteTexture);
  }
  this.tile.setColor([1, 1, 1, 0]);
  this.tile.getXform().setPosition(atX, atY);
  this.tile.getXform().setSize(9, 9);
  this.tile.setElementPixelPositions(pp[0], pp[1], pp[2], pp[3]);
  this.tile.coX = coX;
  this.tile.coY = coY;
  GameObject.call(this, this.tile);
}
gEngine.Core.inheritPrototype(Tile, GameObject)