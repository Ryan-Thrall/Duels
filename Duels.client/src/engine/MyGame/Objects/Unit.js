function Unit(spriteTexture, normalMap, atX, atY, coX, coY, team, type, used, size) {
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
  this.size = size;

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

Unit.prototype.useUnitAction = function (moveToken, Units, structures, AP, pop, spriteSheet, team) {
  let data = [Units, structures, AP, pop]
  if (!moveToken.usable || team != moveToken.team || AP[team - 1][0] <= 0) {
    return data;
  }

  if (moveToken.type == "Move") {
    this.updateCoords(moveToken.coX, moveToken.coY)
    this.getXform().setPosition(moveToken.getXform().getPosition()[0], moveToken.getXform().getPosition()[1]);
    this.useUnit();
    AP[team - 1][0]--;
  }
  else if (moveToken.type == "Attack") {
    // Units = Units.forEach(unit =>  {
    //   if (unit.coX != moveToken.coX || unit.coY != moveToken.coY) {
    //     unit.size--;
    //     if (unit.size <= 0) {
    //       Units.splice()
    //     }
    //   }
    // })

    for (i = 0; i < Units.length; i++) {
      if (Units[i].coX == moveToken.coX && Units[i].coY == moveToken.coY) {
        Units[i].size--;
        if (Units[i].size <= 0) {
          Units.splice(i, 1);
        }
      }
    }

    this.useUnit();
    AP[team - 1][0]--;
  }
  else if (moveToken.type == "Settle") {

    structures.push(new Structure(spriteSheet, null, this.getXform().getPosition()[0], this.getXform().getPosition()[1], this.coX, this.coY, this.team, "humanBase"))

    structures = structures.filter(structure => (structure.coX != this.coX || structure.coY != this.coY || structure.team == this.team))

    this.useUnit();
    AP[team - 1][1]++;
    // Units = Units.filter(unit => (unit.coX != this.coX || unit.coY != this.coY))

    AP[team - 1][0]--;
  }
  else if (moveToken.type == "Bolster" && pop[team - 1] > 0) {
    this.size++;
    this.useUnit();
    AP[team - 1][0]--;
    pop[team - 1]--
  }

  data = [Units, structures, AP, pop]
  return data;


}


Unit.prototype.findMoves = function (Tiles, Units, Structures, actionTokens, spriteSheet, turn) {
  let settleable = true;
  // True if Conditions don't allow a move
  let noMove = false;
  let usable = true;
  Tiles.forEach(tile => {
    let y = tile.coY;
    let x = tile.coX;

    if (tile.coX == this.coX && tile.coY == this.coY && tile.terrain == "water") {
      settleable = false;
    }

    if (tile.checkAdjacent(x, y, this.coX, this.coY) && tile.terrain != "blank") {
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
            actionTokens.push(new ActionToken(spriteSheet, null, tile.getXform().getPosition()[0], tile.getXform().getPosition()[1], x, y, "Attack", usable, this.team))
            noMove = true;
            return;
          }
        }


      })

      // If not occupied place a Move Token
      if (!noMove) {
        actionTokens.push(new ActionToken(spriteSheet, null, tile.getXform().getPosition()[0], tile.getXform().getPosition()[1], x, y, "Move", usable, this.team))
      }



      Structures.forEach(structure => {
        if (structure.coX == x && structure.coY == y) {
          settleable = false;
        }

        if (structure.coX == this.coX && structure.coY == this.coY && this.team == structure.team) {
          settleable = false;
          actionTokens.push(new ActionToken(spriteSheet, null, this.getXform().getPosition()[0] - 1.8, this.getXform().getPosition()[1] + 1.8, this.coX, this.coY, "Bolster", usable, this.team))
        }
      })

      noMove = false;
      usable = true;
    }



  })



  if (settleable) {
    actionTokens.push(new ActionToken(spriteSheet, null, this.getXform().getPosition()[0] + 1.8, this.getXform().getPosition()[1] + 1.8, this.coX, this.coY, "Settle", usable, this.team))
  }

}