

function MoveToken(spriteTexture, normalMap, atX, atY, coX, coY) {
  if (normalMap !== null) {
    this.token = new IllumRenderable(spriteTexture, normalMap);
  } else {
    this.token = new LightRenderable(spriteTexture);
  }
  this.token.setColor([1, 1, 1, 0]);
  this.token.getXform().setPosition(atX, atY);
  this.token.getXform().setSize(4, 4);
  this.token.setElementPixelPositions(280, 312, 0, 32);
  this.coX = coX;
  this.coY = coY;
  GameObject.call(this, this.token);
}
gEngine.Core.inheritPrototype(MoveToken, GameObject);