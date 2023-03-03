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

TurnCoin.prototype.endTurn = function (turn, units, structures, goldAmounts, knowledgeAmounts, teams) {

  // Give Gold and Knowledge for each structure
  structures.forEach(s => {
    if (s.team == turn) {
      goldAmounts[turn - 1]++;
      knowledgeAmounts[turn - 1]++;
    }
  })

  // Update the turn variable
  turn++;

  if (teams.filter(t => t == turn).length == 0) {
    turn = teams[0];
  }

  // Update the coin UI
  if (turn == 1) {
    this.mTurnCoin.setElementPixelPositions(412, 444, 0, 32)
  } else if (turn == 2) {
    this.mTurnCoin.setElementPixelPositions(412, 444, 33, 65)
  }

  // Unuse all units
  units.forEach(u => {
    u.used = false;
    u.unselectUnit();
  })

  return [units, turn, goldAmounts, knowledgeAmounts]
}

TurnCoin.prototype.giveResources = function (turn, goldAmounts, knowledgeAmounts, housingAmounts, structures) {


  return [goldAmounts, knowledgeAmounts];
}