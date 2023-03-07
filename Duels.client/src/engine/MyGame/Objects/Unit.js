function Unit(spriteTexture, normalMap, atX, atY, coX, coY, num, team, type, used, size) {
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
  this.num = num;

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

Unit.prototype.updateCoords = function (coX, coY, num) {
  this.coX = coX;
  this.coY = coY;
  this.num = num;
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
    this.updateCoords(moveToken.coX, moveToken.coY, moveToken.num)
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

    structures.push(new Structure(spriteSheet, null, this.getXform().getPosition()[0], this.getXform().getPosition()[1], this.coX, this.coY, this.num, this.team, "humanBase"))
    let before = structures.length

    for (i = 0; i < structures.length; i++) {
      if (structures[i].coX == this.coX && structures[i].coY == this.coY && structures[i].team != this.team) {
        AP[structures[i].team - 1][1]--;
        structures.splice(i, 1)
      }
    }



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


Unit.prototype.findActions = function (Tiles, Units, Structures, actionTokens, spriteSheet, turn) {
  let usable = true;
  let adjTiles = [];
  let adjUnits = [];
  let adjStructs = [];
  trueAdj = [];

  // Check if action tokens should be usable
  if (this.team != turn) {
    usable = false;
  }

  // Find Swordsman Actions
  if (this.type == "Swordsman") {
    // Find Adjacencies
    let data = this.findAdjacencies(Tiles, Units, Structures);
    adjTiles = data[0];
    adjUnits = data[1];
    adjStructs = data[2];

    let settleable = true;

    // Loop Through Adjacent Tiles
    adjTiles.forEach(tile => {
      // Add a Move token if moveable
      if (this.Moves1(tile, adjUnits)) {
        actionTokens.push(new ActionToken(spriteSheet, null, tile.getXform().getPosition()[0], tile.getXform().getPosition()[1], tile.coX, tile.coY, tile.num, "Move", usable, this.team))
        // Add an Attack token if attackable
      } else if (this.Attacks1(tile, adjUnits)) {
        actionTokens.push(new ActionToken(spriteSheet, null, tile.getXform().getPosition()[0], tile.getXform().getPosition()[1], tile.coX, tile.coY, tile.num, "Attack", usable, this.team))
      }

      // If Unit is on water make unsettleable
      if (tile.num == this.num && tile.terrain == "water") {
        settleable = false;
      }
    })

    // Find Same Tile Moves
    adjStructs.forEach(struct => {
      if (this.Bolster(struct)) {
        actionTokens.push(new ActionToken(spriteSheet, null, this.getXform().getPosition()[0] - 1.8, this.getXform().getPosition()[1] + 1.8, this.coX, this.coY, this.num, "Bolster", usable, this.team))
      }
    })

    if (this.Settle(adjStructs, settleable)) {
      actionTokens.push(new ActionToken(spriteSheet, null, this.getXform().getPosition()[0] + 1.8, this.getXform().getPosition()[1] + 1.8, this.coX, this.coY, this.num, "Settle", usable, this.team))
    }

  }
  // Find Cavalry Actions
  else if (this.type == "Cavalry") {
    // Find Adjacencies
    let data = this.findDoubleAdjacencies(Tiles, Units, Structures);
    adjTiles = data[0];
    adjUnits = data[1];
    adjStructs = data[2];
    blockers = data[3]
    // console.log(blockers)
    // console.log(this.coX, this.coY)
    console.log(adjTiles)

    let settleable = true;
    let blocked = [];

    // blockers.forEach(blocker => {
    //   if (blocker.coY == this.coY && blocker.coX == this.coX - 1) {
    //     blocked.push(blocker.num - 1)
    //   }
    //   else if (blocker.coY == this.coY && blocker.coX == this.coX + 1) {
    //     blocked.push(blocker.num + 1)
    //   }
    //   else if (blocker.coY == this.coY + 1 && blocker.coX == this.coX - 1) {
    //     blocked.push()
    //   }
    // })
    // console.log(blocked)

    // Loop Through Adjacent Tiles
    adjTiles.forEach(tile => {

      // Add a Move token if moveable
      if (this.Moves2(tile, adjUnits, blocked)) {
        actionTokens.push(new ActionToken(spriteSheet, null, tile.getXform().getPosition()[0], tile.getXform().getPosition()[1], tile.coX, tile.coY, tile.num, "Move", usable, this.team))
        // Add an Attack token if attackable
      } else if (this.Attacks1(tile, adjUnits)) {
        actionTokens.push(new ActionToken(spriteSheet, null, tile.getXform().getPosition()[0], tile.getXform().getPosition()[1], tile.coX, tile.coY, tile.num, "Attack", usable, this.team))
      }

      // If Unit is on water make unsettleable
      if (tile.num == this.num && tile.terrain == "water") {
        settleable = false;
      }
    })

    // Find Same Tile Moves
    adjStructs.forEach(struct => {
      if (this.Bolster(struct)) {
        actionTokens.push(new ActionToken(spriteSheet, null, this.getXform().getPosition()[0] - 1.8, this.getXform().getPosition()[1] + 1.8, this.coX, this.coY, this.num, "Bolster", usable, this.team))
      }
    })

    if (this.Settle(adjStructs, settleable)) {
      actionTokens.push(new ActionToken(spriteSheet, null, this.getXform().getPosition()[0] + 1.8, this.getXform().getPosition()[1] + 1.8, this.coX, this.coY, this.num, "Settle", usable, this.team))
    }
  }

}

Unit.prototype.findAdjacencies = function (Tiles, Units, Structures) {
  let adjTiles = [];
  let adjUnits = [];
  let adjStructs = [];

  Tiles.forEach(tile => {
    if (MyGame.prototype.checkAdjacent(tile.coX, tile.coY, this.coX, this.coY)) {
      adjTiles.push(tile);
    }
  })

  Units.forEach(unit => {
    if (MyGame.prototype.checkAdjacent(unit.coX, unit.coY, this.coX, this.coY)) {
      adjUnits.push(unit);
    }
  })

  Structures.forEach(struct => {
    if (MyGame.prototype.checkAdjacent(struct.coX, struct.coY, this.coX, this.coY)) {
      adjStructs.push(struct);
    }
  })

  return [adjTiles, adjUnits, adjStructs];

}

Unit.prototype.findDoubleAdjacencies = function (Tiles, Units, Structures) {
  let adjTiles = [];
  let dubAdjTiles = [];
  let allTiles = [];
  let adjUnits = [];
  let adjStructs = [];
  let blockers = [];

  Units.forEach(unit => {
    if (MyGame.prototype.checkDoubleAdjacent(unit.coX, unit.coY, this.coX, this.coY)) {
      adjUnits.push(unit);
    }

    if (MyGame.prototype.checkAdjacent(unit.coX, unit.coY, this.coX, this.coY) && unit.num != this.num) {
      blockers.push(unit.num)
    }
  })

  Tiles.forEach(tile => {
    if (MyGame.prototype.checkAdjacent(tile.coX, tile.coY, this.coX, this.coY)) {
      adjTiles.push(tile);
    }
  })

  adjTiles.forEach(adjTile => {
    Tiles.forEach(tile => {
      if (!blockers.includes(adjTile.num)) {
        if (MyGame.prototype.checkAdjacent(tile.coX, tile.coY, adjTile.coX, adjTile.coY) && !adjTiles.some(tille => tille.num == tile.num)) {
          dubAdjTiles.push(tile)
        }
      }
    })

  })

  allTiles = dubAdjTiles.concat(adjTiles);



  Structures.forEach(struct => {
    if (MyGame.prototype.checkDoubleAdjacent(struct.coX, struct.coY, this.coX, this.coY)) {
      adjStructs.push(struct);
    }
  })

  return [allTiles, adjUnits, adjStructs, blockers];

}

Unit.prototype.Moves1 = function (tile, adjUnits) {
  let noMove = true;
  adjUnits.forEach(unit => {
    if (unit.num == tile.num) {
      noMove = false;
      return noMove;
    }
  })

  return noMove;
}

Unit.prototype.Moves2 = function (tile, adjUnits, blocked) {
  let noMove = true;
  adjUnits.forEach(unit => {
    if (unit.num == tile.num || blocked.includes(tile.num)) {
      noMove = false;
      return noMove;
    }
  })

  return noMove;
}

Unit.prototype.Attacks1 = function (tile, adjUnits) {
  let noAttack = false;
  adjUnits.forEach(unit => {
    if (unit.num == tile.num && unit.team != this.team) {
      noAttack = true;
      return noAttack;
    }
  })

  return noAttack;
}

Unit.prototype.Bolster = function (struct) {
  // If on a structure make unsettleable
  if (struct.num == this.num && struct.team == this.team) {
    return true;
  }

  return false;
}

Unit.prototype.Settle = function (adjStructs, settleable) {
  if (adjStructs.length == 0 && settleable || adjStructs.length > 0 && adjStructs[0].team != this.team && adjStructs[0].num == this.num) {
    return true;
  }

  return false;
}