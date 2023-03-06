

function ActionToken(spriteTexture, normalMap, atX, atY, coX, coY, type, usable, team) {
  if (normalMap !== null) {
    this.token = new IllumRenderable(spriteTexture, normalMap);
  } else {
    this.token = new LightRenderable(spriteTexture);
  }
  let pp = [0, 0, 0, 0];
  let size = 4;

  if (type == "Move") {
    pp = [280, 312, 0, 32];

  }
  else if (type == "Attack") {
    pp = [280, 312, 33, 65];
  } else if (type == "Settle") {
    pp = [280, 312, 66, 98];
    size = 3;
  } else if (type == "Bolster") {
    pp = [280, 312, 99, 131];
    size = 3;
  }

  this.token.setColor([1, 1, 1, 0]);
  this.token.getXform().setPosition(atX, atY);
  this.token.getXform().setSize(size, size);
  this.token.setElementPixelPositions(pp[0], pp[1], pp[2], pp[3]);
  this.coX = coX;
  this.coY = coY;
  this.type = type;
  this.usable = usable;
  this.team = team;
  GameObject.call(this, this.token);
}
gEngine.Core.inheritPrototype(ActionToken, GameObject);