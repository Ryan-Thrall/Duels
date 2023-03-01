

function Tile(spriteTexture, normalMap, atX, atY, pp, coX, coY, terrain) {
  if (normalMap !== null) {
    this.tile = new IllumRenderable(spriteTexture, normalMap);
  } else {
    this.tile = new LightRenderable(spriteTexture);
  }
  this.tile.setColor([1, 1, 1, 0]);
  this.tile.getXform().setPosition(atX, atY);
  this.tile.getXform().setSize(9, 9);
  this.tile.setElementPixelPositions(pp[0], pp[1], pp[2], pp[3]);
  this.coX = coX;
  this.coY = coY;
  this.tile.terrain = terrain;
  GameObject.call(this, this.tile);
}
gEngine.Core.inheritPrototype(Tile, GameObject)

Tile.prototype.checkAdjacent = function (x, y, coX, coY) {
  // Sideways Movement
  if (y == coY) {
    if (x == coX - 1 || x == coX + 1) {
      return true;
    }
  }

  // Down Movement
  else if (y == coY + 1) {
    if (coY % 2 == 0) {
      if (x == coX || x == coX - 1) {
        return true;
      }
    } else {
      if (x == coX || x == coX + 1) {
        return true;
      }
    }
  }

  // Up Movement
  else if (y == coY - 1) {
    if (coY % 2 == 0) {
      if (x == coX || x == coX - 1) {
        return true;
      }
    } else {
      if (x == coX || x == coX + 1) {
        return true;
      }
    }
  }


  return false;
}