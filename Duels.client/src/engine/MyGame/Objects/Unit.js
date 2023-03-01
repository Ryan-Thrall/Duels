function Unit(spriteTexture, normalMap, atX, atY, coX, coY, team, type, used) {
  if (normalMap !== null) {
    this.unit = new IllumRenderable(spriteTexture, normalMap);
  } else {
    this.unit = new LightRenderable(spriteTexture);
  }

  this.pp;

  if (team == 1) {
    pp = [0, 32, 0, 0];
  } else if (team == 2) {
    pp = [34, 66, 0, 0];
  }

  if (type == "Swordsman") {
    pp[2] = 230;
    pp[3] = 262;
  } else if (type == "General") {
    pp[2] = 197;
    pp[3] = 229;
  } else if (type == "Archer") {
    pp[2] = 164;
    pp[3] = 196;
  } else if (type == "Shieldman") {
    pp[2] = 131;
    pp[3] = 163;
  } else if (type == "Cavalry") {
    pp[2] = 98;
    pp[3] = 130;
  }

  this.unit.setColor([1, 1, 1, 0]);
  this.unit.getXform().setPosition(atX, atY);
  if (used) {
    this.unit.getXform().setSize(4, 4)
  } else {
    this.unit.getXform().setSize(5, 5);
  }

  this.unit.setElementPixelPositions(pp[0], pp[1], pp[2], pp[3]);//65 97
  this.coX = coX;
  this.coY = coY;
  this.team = team;
  this.type = type;
  this.used = used;
  GameObject.call(this, this.unit);
}
gEngine.Core.inheritPrototype(Unit, GameObject);

Unit.prototype.selectUnit = function () {
  if (this.used) {
    this.unit.getXform().setSize(4, 4);
  } else {
    this.unit.getXform().setSize(6, 6);
  }


}

Unit.prototype.unselectUnit = function () {
  if (this.used) {
    this.unit.getXform().setSize(4, 4);
  } else {
    this.unit.getXform().setSize(5, 5);
  }

}

Unit.prototype.updateCoords = function (coX, coY) {
  this.coX = coX;
  this.coY = coY;
}

Unit.prototype.useUnit = function () {
  this.used = true;
  this.unit.getXform().setSize(4, 4);
}

Unit.prototype.useUnitAction = function (moveToken, Units, goldAmounts, redText, blueText) {
  console.log(moveToken.usable)
  if (!moveToken.usable) {
    return Units;
  }
  Units.forEach(u => u.used = false)

  if (moveToken.type == "Move") {
    this.updateCoords(moveToken.coX, moveToken.coY)
    this.getXform().setPosition(moveToken.getXform().getPosition()[0], moveToken.getXform().getPosition()[1]);
    this.useUnit();
  }
  else if (moveToken.type == "Attack") {
    Units = Units.filter(unit => (unit.coX != moveToken.coX || unit.coY != moveToken.coY))
    this.useUnit();
  }

  // if (this.team == 1) {
  //   goldAmounts[0]++;
  //   redText.setText("x " + goldAmounts[0])
  // } else if (this.team == 2) {
  //   goldAmounts[1]++;
  //   blueText.setText("x " + goldAmounts[1])
  // }

  return Units;


}

Unit.prototype.findMoves = function (Tiles, Units, actionTokens, spriteSheet, turn) {
  // True if Conditions don't allow a move
  let noMove = false;
  let usable = true;
  Tiles.forEach(tile => {
    let y = tile.coY;
    let x = tile.coX;
    if (tile.checkAdjacent(x, y, this.coX, this.coY) && tile.terrain != "b") {
      if (this.team != turn) {
        usable = false;
      }

      // For each unit
      Units.forEach(unit => {
        // If unit is on adjacent tile
        if (unit.coX == x && unit.coY == y) {

          // If unit is a team mate block movement
          if (unit.team == this.team) {
            noMove = true
            return;

            // If unit is an enemy setup an attack token
          } else if (unit.team != this.team) {
            actionTokens.push(new ActionToken(spriteSheet, null, tile.getXform().getPosition()[0], tile.getXform().getPosition()[1], x, y, "Attack", usable))
            noMove = true;
            return;
          }
        }


      })

      // If not occupied place a Move Token
      if (!noMove) {
        actionTokens.push(new ActionToken(spriteSheet, null, tile.getXform().getPosition()[0], tile.getXform().getPosition()[1], x, y, "Move", usable))
      }

      noMove = false;
      usable = true;
    }
  })


}