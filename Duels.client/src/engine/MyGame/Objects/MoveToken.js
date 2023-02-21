

function MoveToken(spriteTexture, normalMap, atX, atY) {
  if (normalMap !== null) {
    this.token = new IllumRenderable(spriteTexture, normalMap);
  } else {
    this.token = new LightRenderable(spriteTexture);
  }
  this.token.setColor([1, 1, 1, 0]);
  this.token.getXform().setPosition(atX, atY);
  this.token.getXform().setSize(3, 3);
  this.token.setElementPixelPositions(280, 312, 0, 32);
  GameObject.call(this, this.token);
}
gEngine.Core.inheritPrototype(MoveToken, GameObject);