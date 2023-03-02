

function Tile(spriteTexture, normalMap, atX, atY, coX, coY, terrain) {
  if (normalMap !== null) {
    this.tile = new IllumRenderable(spriteTexture, normalMap);
  } else {
    this.tile = new LightRenderable(spriteTexture);
  }

  this.terrain = terrain;
  this.pp = [];
  if (this.terrain == "plains") {
    this.pp = [0, 55, 0, 64];
  } else if (this.terrain == "water") {
    this.pp = [56, 111, 0, 64]
  } else if (this.terrain == "hills") {
    this.pp = [112, 167, 0, 64]
  } else if (this.terrain == "forest") {
    this.pp = [168, 223, 0, 64]
  }

  this.tile.setColor([1, 1, 1, 0]);
  this.tile.getXform().setPosition(atX, atY);
  this.tile.getXform().setSize(9, 9);
  this.tile.setElementPixelPositions(this.pp[0], this.pp[1], this.pp[2], this.pp[3]);
  this.coX = coX;
  this.coY = coY;

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