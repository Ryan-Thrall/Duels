function TurnCoin(spriteTexture, normalMap, atX, atY, turn) {
  if (normalMap !== null) {
    this.mTurnCoin = new IllumRenderable(spriteTexture, normalMap);
  } else {
    this.mTurnCoin = new LightRenderable(spriteTexture);
  }

  this.pp;

  if (turn == 1) {
    pp = [412, 444, 0, 32]
  } else if (turn == 2) {
    pp = [412, 444, 33, 65]
  }

  this.mTurnCoin.getXform().setPosition(atX, atY);
  this.mTurnCoin.getXform().setSize(30, 30)
  this.mTurnCoin.setElementPixelPositions(pp[0], pp[1], pp[2], pp[3]);


  GameObject.call(this, this.mTurnCoin);
}
gEngine.Core.inheritPrototype(TurnCoin, GameObject);

TurnCoin.prototype.endTurn = function (turn, units) {
  if (turn == 1) {
    this.mTurnCoin.setElementPixelPositions(412, 444, 0, 32)
  } else if (turn == 2) {
    this.mTurnCoin.setElementPixelPositions(412, 444, 33, 65)
  }

  units.forEach(u => {
    u.used = false;
    u.unselectUnit();
  })

  return units
}

TurnCoin.prototype.giveGold = function (turn, goldAmounts, structures) {
  structures.forEach(s => {
    if (s.team == turn) {
      goldAmounts[turn - 1]++;
    }
  })

  return goldAmounts;
}