const { mat2, mat2d, mat4, mat3, quat, quat2, vec2, vec3, vec4 } = glMatrix;

// ANCHOR Initialization
// SECTION Initial Variables
function MyGame(gameData) {

  // NOTE Game Data and Sprites
  this.gameData = gameData;

  // The Spritesheet
  this.kSpriteSheet = "src/assets/img/SpriteSheet.png";

  // NOTE Cameras
  this.mCamera = null;

  this.mResourceUICamera = null;

  this.mStructureMenuCamera = null;

  // NOTE Game Data Holders
  this.mMapData = null;
  this.mStructData = null;
  this.mUnitData = null;

  // NOTE Arrays of Objects
  this.mTiles = [];
  this.mUnits = [];
  this.mStructures = [];
  this.mActionTokens = [];
  this.mMenuItems = [];

  // NOTE the holds data about the selected object
  this.mSelectObject = {
    index: null,
    array: null,
    team: null,
  };

  // NOTE Arrays of Resource quantities
  this.mAPAmounts = [[1, 1], [1, 1]]
  this.mGoldAmounts = [0, 0];
  this.mKnowledgeAmounts = [0, 0];
  this.mPopulationAmounts = [99, 99];

  // NOTE UI Text and Images
  this.mRedCoin = null;
  this.mRedGoldText = null;

  this.mRedKnowledge = null;
  this.mRedKnowledgeText = null;

  this.mRedPopulation = null;
  this.mRedPopulationText = null;

  this.mBlueCoin = null;
  this.mBlueGoldText = null;

  this.mBlueKnowledge = null;
  this.mBlueKnowledgeText = null;

  this.mBluePopulation = null;
  this.mBluePopulationText = null;

  this.mRedAPText = null;
  this.mBlueAPText = null;

  this.mTurnCoin = null;

  this.mUnitPowers = [];
  this.mTileNums = [];

  // A tiny sprite used to check for collisions with mouse clicks and mouse hovers
  this.selectBox = null;
  this.cursorBox = null;

  // NOTE Turn Tracking Data
  this.teams = [];
  this.turn = null;

}
gEngine.Core.inheritPrototype(MyGame, Scene);

// !SECTION

// SECTION Loading and Unloading Resources

// Load the spritesheet
MyGame.prototype.loadScene = function () {
  gEngine.Textures.loadTexture(this.kSpriteSheet);
};

// Unload the spritesheet
MyGame.prototype.unloadScene = function () {
  gEngine.Textures.unloadTexture(this.kSpriteSheet);
};

// !SECTION

// SECTION Initialize Cameras and Objects
MyGame.prototype.initialize = function () {

  // FIXME Fixes Brightness Bug (May Find Better Solution Later)
  gEngine.DefaultResources.setGlobalAmbientIntensity(3.5)

  // NOTE Main Camera
  this.mCamera = new Camera(
    vec2.fromValues(50, 36),
    125,
    [0, 0, 1366, 768]
  );
  this.mCamera.setBackgroundColor([0.796, 0.796, 0.796, 1.0]);// [0.05, 0.02, 0.06, 1.0]

  // NOTE Resource Camera
  this.mResourceUICamera = new Camera(
    vec2.fromValues(50, 36),
    100,
    [0, 0, 200, 768]
  );
  this.mResourceUICamera.setBackgroundColor([0.4, 0.4, 0.4, 1.0]);

  // NOTE Structure Menu Camera
  this.mStructureMenuCamera = new Camera(vec2.fromValues(50, 36),
    100,
    [1166, 0, 200, 768]
  );
  this.mStructureMenuCamera.setBackgroundColor([0.4, 0.4, 0.4, 1.0]);

  // NOTE Data Conversion
  this.mMapData = this.gameData.terrainData.split("-");
  this.mStructData = this.gameData.structureData.split("-");
  this.mUnitData = this.gameData.troopData.split("-");

  // NOTE Setup Mouse Detection
  this.selectBox = new MouseSelect(this.kSpriteSheet, null, 0, 0);
  this.cursorBox = new MouseSelect(this.kSpriteSheet, null, 0, 0);

  // NOTE Read Map Data
  this.createHexMap();

  // REVIEW Player 1 Starts
  this.turn = this.teams[0]

  // NOTE Setup Resource UI
  this.setupResourceUI();



};

// SECTION Initialize Resource UI
MyGame.prototype.setupResourceUI = function () {
  // Setup Resource UI

  this.mTurnCoin = new TurnCoin(this.kSpriteSheet, null, 46.5, 210, this.turn);

  this.mRedAPText = new FontRenderable("APx " + this.mAPAmounts[0][0] + "/" + this.mAPAmounts[0][1])
  this.mRedAPText.setColor([0.4, 0, 0, 1]);
  this.mRedAPText.getXform().setPosition(10, 190);
  this.mRedAPText.setTextHeight(15);

  this.mRedCoin = new LightRenderable(this.kSpriteSheet);
  this.mRedCoin.getXform().setSize(20, 20);
  this.mRedCoin.getXform().setPosition(12, 168);
  this.mRedCoin.setElementPixelPositions(313, 345, 0, 32);

  this.mRedGoldText = new FontRenderable("x " + this.mGoldAmounts[0]);
  this.mRedGoldText.setColor([0, 0, 0, 1]);
  this.mRedGoldText.getXform().setPosition(28, 170);
  this.mRedGoldText.setTextHeight(15);

  this.mRedKnowledge = new LightRenderable(this.kSpriteSheet);
  this.mRedKnowledge.getXform().setSize(20, 20);
  this.mRedKnowledge.getXform().setPosition(12, 146);
  this.mRedKnowledge.setElementPixelPositions(313, 345, 33, 65);

  this.mRedKnowledgeText = new FontRenderable("x " + this.mKnowledgeAmounts[0]);
  this.mRedKnowledgeText.setColor([0, 0, 0, 1]);
  this.mRedKnowledgeText.getXform().setPosition(28, 148);
  this.mRedKnowledgeText.setTextHeight(15);

  this.mRedPopulation = new LightRenderable(this.kSpriteSheet);
  this.mRedPopulation.getXform().setSize(20, 20);
  this.mRedPopulation.getXform().setPosition(12, 124);
  this.mRedPopulation.setElementPixelPositions(313, 345, 66, 98);

  this.mRedPopulationText = new FontRenderable("x " + this.mPopulationAmounts[0]);
  this.mRedPopulationText.setColor([0, 0, 0, 1]);
  this.mRedPopulationText.getXform().setPosition(28, 126);
  this.mRedPopulationText.setTextHeight(15);

  this.mBlueAPText = new FontRenderable("APx " + this.mAPAmounts[1][0] + "/" + this.mAPAmounts[1][1])
  this.mBlueAPText.setColor([0, 0, 0.4, 1]);
  this.mBlueAPText.getXform().setPosition(10, 102);
  this.mBlueAPText.setTextHeight(15);

  this.mBlueCoin = new LightRenderable(this.kSpriteSheet);
  this.mBlueCoin.getXform().setSize(20, 20);
  this.mBlueCoin.getXform().setPosition(12, 80);
  this.mBlueCoin.setElementPixelPositions(346, 378, 0, 32);

  this.mBlueGoldText = new FontRenderable("x " + this.mGoldAmounts[1]);
  this.mBlueGoldText.setColor([0, 0, 0, 1]);
  this.mBlueGoldText.getXform().setPosition(28, 82);
  this.mBlueGoldText.setTextHeight(15);

  this.mBlueKnowledge = new LightRenderable(this.kSpriteSheet);
  this.mBlueKnowledge.getXform().setSize(20, 20);
  this.mBlueKnowledge.getXform().setPosition(12, 58);
  this.mBlueKnowledge.setElementPixelPositions(346, 378, 33, 65);

  this.mBlueKnowledgeText = new FontRenderable("x " + this.mKnowledgeAmounts[1]);
  this.mBlueKnowledgeText.setColor([0, 0, 0, 1]);
  this.mBlueKnowledgeText.getXform().setPosition(28, 60);
  this.mBlueKnowledgeText.setTextHeight(15);

  this.mBluePopulation = new LightRenderable(this.kSpriteSheet);
  this.mBluePopulation.getXform().setSize(20, 20);
  this.mBluePopulation.getXform().setPosition(12, 36);
  this.mBluePopulation.setElementPixelPositions(346, 378, 66, 98);

  this.mBluePopulationText = new FontRenderable("x " + this.mPopulationAmounts[1]);
  this.mBluePopulationText.setColor([0, 0, 0, 1]);
  this.mBluePopulationText.getXform().setPosition(28, 38);
  this.mBluePopulationText.setTextHeight(15);
}

// !SECTION

// SECTION Map Data Function
MyGame.prototype.createHexMap = function () {
  // NOTE Coordinate Variables
  var coX = 0;
  var coY = 0;
  var num = 0;

  var x = 0;
  var y = 0;

  // Terrain type
  var terrain = "";

  // # of Rows
  var r = 1;

  // Pixel position variables
  var pp = [];
  var team;

  // Set pixel position based off terrain type
  for (tile in this.mMapData) {
    if (this.mMapData[tile][0] == "l") {
      terrain = "plains"
    } else if (this.mMapData[tile][0] == "w") {
      terrain = "water"
    } else if (this.mMapData[tile][0] == "h") {
      terrain = "hills"
    } else if (this.mMapData[tile][0] == "f") {
      terrain = "forest"
    }

    // Create the new tile
    this.mTiles.push(new Tile(this.kSpriteSheet, null, x * 8.8 + 24, 56.5 - (y * 10), coX, coY, num, terrain));

    // Select the row of the spritesheet based off player color
    if (this.mStructData[tile].substr(0, 1) == "1") {
      pp = [0, 32, 0, 0];
      team = 1;
      this.teams.push(1);
    } else if (this.mStructData[tile].substr(0, 1) == "2") {
      pp = [34, 66, 0, 0];
      team = 2;
      this.teams.push(2)
    }

    // Add a townhall structure if on this tile
    if (this.mStructData[tile].substr(1) == "hb") {
      pp[2] = 65;
      pp[3] = 97;

      this.mStructures.push(new Structure(this.kSpriteSheet, null, x * 8.8 + 24, 56.5 - (y * 10), coX, coY, num, team, "humanBase"));
    }

    // Add a unit if on this tile
    if (this.mUnitData[tile].substr(1) == "hs") {
      this.mUnits.push(new Unit(this.kSpriteSheet, null, x * 8.8 + 24, 56.5 - (y * 10), coX, coY, num, team, "Swordsman", false, 1));
    }

    // Move the tile over one
    x += 1;
    coX += 1;

    if (coX > 7) {
      y += 0.68;
      coY += 1;
      r++;
      coX = 0;
      if (r % 2 == 0) {
        x = 0.5;
      } else {
        x = 0;
      }
    }

    num++;
  }
}

// !SECTION

// !SECTION

// ANCHOR Drawing
MyGame.prototype.draw = function () {
  // Clear the canvas to the default color
  gEngine.Core.clearCanvas([0.796, 0.796, 0.796, 1.0]);

  // Setup the main camera
  this.mCamera.setupViewProjection();

  // Draw the tiles
  for (tile in this.mTiles) {
    this.mTiles[tile].draw(this.mCamera);
    // let pos = this.mTiles[tile].getXform().getPosition()
    // this.mTileNums.push(new FontRenderable("" + this.mTiles[tile].num))
    // this.mTileNums[tile].setColor([1, 1, 1, 1]);
    // this.mTileNums[tile].getXform().setPosition(pos[0], pos[1]);
    // this.mTileNums[tile].setTextHeight(2);
  }

  // for (nums in this.mTileNums) {
  //   this.mTileNums[nums].draw(this.mCamera)
  // }

  // Draw the structures
  for (struct in this.mStructures) {
    this.mStructures[struct].draw(this.mCamera)
  }

  this.mUnitPowers = [];
  // Draw the Units
  for (unit in this.mUnits) {
    this.mUnits[unit].draw(this.mCamera)
    let pos = this.mUnits[unit].getXform().getPosition()
    this.mUnitPowers.push(new FontRenderable("x " + this.mUnits[unit].size))
    this.mUnitPowers[unit].setColor([1, 1, 1, 1]);
    this.mUnitPowers[unit].getXform().setPosition(pos[0] - 0.6, pos[1] - 1.4);
    this.mUnitPowers[unit].setTextHeight(1);
  }

  // Draw the action tokens
  for (token in this.mActionTokens) {
    this.mActionTokens[token].draw(this.mCamera)
  }

  for (power in this.mUnitPowers) {
    this.mUnitPowers[power].draw(this.mCamera)
  }

  // Setup the Resource Camera
  this.mResourceUICamera.setupViewProjection();

  // Draw the Red UI Info
  this.mRedAPText.draw(this.mResourceUICamera);

  this.mRedCoin.draw(this.mResourceUICamera);
  this.mRedGoldText.draw(this.mResourceUICamera);

  this.mRedKnowledge.draw(this.mResourceUICamera)
  this.mRedKnowledgeText.draw(this.mResourceUICamera)

  this.mRedPopulation.draw(this.mResourceUICamera)
  this.mRedPopulationText.draw(this.mResourceUICamera)

  // Draw the Blue UI Info
  this.mBlueAPText.draw(this.mResourceUICamera);

  this.mBlueCoin.draw(this.mResourceUICamera);
  this.mBlueGoldText.draw(this.mResourceUICamera);

  this.mBlueKnowledge.draw(this.mResourceUICamera)
  this.mBlueKnowledgeText.draw(this.mResourceUICamera)

  this.mBluePopulation.draw(this.mResourceUICamera)
  this.mBluePopulationText.draw(this.mResourceUICamera)

  // Draw the Turn Coin
  this.mTurnCoin.draw(this.mResourceUICamera);

  // If the Menu has anything to display
  if (this.mMenuItems.length > 0) {
    // Setup the Structure Menu Camera
    this.mStructureMenuCamera.setupViewProjection();

    // Draw the Menu Items
    for (item in this.mMenuItems) {
      this.mMenuItems[item].menuItem.draw(this.mStructureMenuCamera);
    }
  }




};

// ANCHOR Updating

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
  let cameraPos = this.mCamera.getViewport();

  // Camera Controls
  if (gEngine.Input.isKeyPressed(gEngine.Input.keys.W)) {
    cameraPos[1] -= 5;
    this.mCamera.setViewport(cameraPos);
  }
  if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
    cameraPos[0] += 5;
    this.mCamera.setViewport(cameraPos);
  }
  if (gEngine.Input.isKeyPressed(gEngine.Input.keys.S)) {
    cameraPos[1] += 5;
    this.mCamera.setViewport(cameraPos);
  }
  if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
    cameraPos[0] -= 5;
    this.mCamera.setViewport(cameraPos);
  }


  // Set the Default Cursor
  this.updateCursor()

  // If Mouse is left clicked on canvas
  if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left)) {
    if (this.mCamera.isMouseInViewport() || this.mStructureMenuCamera.isMouseInViewport()) {

      // Unselect all units
      this.mUnits.forEach(u => {
        u.unselectUnit();
      })
      this.mStructures.forEach(s => {
        s.unselectStructure();
      })

      this.checkMouseSelect(this.mCamera.mouseWCX(), this.mCamera.mouseWCY(), this.mStructureMenuCamera.mouseWCX(), this.mStructureMenuCamera.mouseWCY())
    }
  };

  this.mRedAPText.setText("APx " + this.mAPAmounts[0][0] + "/" + this.mAPAmounts[0][1])
  this.mRedGoldText.setText("x " + this.mGoldAmounts[0])
  this.mRedKnowledgeText.setText("x " + this.mKnowledgeAmounts[0])
  this.mRedPopulationText.setText("x " + this.mPopulationAmounts[0])

  this.mBlueAPText.setText("APx " + this.mAPAmounts[1][0] + "/" + this.mAPAmounts[1][1])
  this.mBlueGoldText.setText("x " + this.mGoldAmounts[1])
  this.mBlueKnowledgeText.setText("x " + this.mKnowledgeAmounts[1])
  this.mBluePopulationText.setText("x " + this.mPopulationAmounts[1])

  // this.mUnits.forEach(u => {
  // })
}

MyGame.prototype.updateCursor = function () {
  // Set the cursor to default
  document.body.style.cursor = "auto";

  // Set Cursor to pointer if it's touching a unit, action token, structure, or Menu Item.
  let h = [];
  this.cursorBox.getXform().setPosition(this.mCamera.mouseWCX(), this.mCamera.mouseWCY())
  for (let i = 0; i < this.mUnits.length; i++) {
    if (this.cursorBox.pixelTouches(this.mUnits[i], h)) {
      document.body.style.cursor = "pointer"
    }
  }
  for (let i = 0; i < this.mActionTokens.length; i++) {
    if (this.cursorBox.pixelTouches(this.mActionTokens[i], h)) {
      document.body.style.cursor = "pointer"
    }
  }
  for (let i = 0; i < this.mStructures.length; i++) {
    if (this.cursorBox.pixelTouches(this.mStructures[i], h)) {
      document.body.style.cursor = "pointer"
    }
  }

  this.cursorBox.getXform().setPosition(this.mResourceUICamera.mouseWCX(), this.mResourceUICamera.mouseWCY())
  if (this.cursorBox.pixelTouches(this.mTurnCoin, h)) {
    document.body.style.cursor = "pointer"
  }

  this.cursorBox.getXform().setPosition(this.mStructureMenuCamera.mouseWCX(), this.mStructureMenuCamera.mouseWCY())
  for (let i = 0; i < this.mMenuItems.length; i++) {
    if (this.cursorBox.pixelTouches(this.mMenuItems[i], h)) {
      document.body.style.cursor = "pointer"
    }
  }
}

MyGame.prototype.setupStructMenu = function (structIndex) {
  let struct = this.mStructures[structIndex]

  let pp = [0, 0, 0, 0]
  if (struct.team == 1) {
    pp[0] = 0;
    pp[1] = 32;
  }
  else if (struct.team == 2) {
    pp[0] = 33;
    pp[1] = 65;
  }

  let units = [];

  this.mUnits.forEach(unit => {
    if (unit.team == this.mStructures[structIndex].team) {
      units.push(unit.type)
    }
  })
  console.log(units)

  if (!units.includes("Swordsman")) {
    this.mMenuItems.push(new MenuItem(this.kSpriteSheet, null, 60, 210, [pp[0], pp[1], 230, 262], 0, "Swordsman"));
  }
  if (!units.includes("General")) {
    this.mMenuItems.push(new MenuItem(this.kSpriteSheet, null, 35, 190, [pp[0], pp[1], 197, 229], 0, "General"));
  }
  if (!units.includes("Archer")) {
    this.mMenuItems.push(new MenuItem(this.kSpriteSheet, null, 60, 170, [pp[0], pp[1], 164, 196], 0, "Archer"));
  }
  if (!units.includes("Shieldman")) {
    this.mMenuItems.push(new MenuItem(this.kSpriteSheet, null, 35, 150, [pp[0], pp[1], 131, 163], 0, "Shieldman"));
  }
  if (!units.includes("Cavalry")) {
    this.mMenuItems.push(new MenuItem(this.kSpriteSheet, null, 60, 130, [pp[0], pp[1], 98, 130], 0, "Cavalry"));
  }






}


MyGame.prototype.checkMouseSelect = function (mouseX, mouseY, menuX, menuY) {
  // Place the select Box at the click point
  let h = []
  this.selectBox.getXform().setPosition(mouseX, mouseY)


  // If Mouse clicked an action token
  for (let i = 0; i < this.mActionTokens.length; i++) {
    if (this.selectBox.pixelTouches(this.mActionTokens[i], h)) {
      // Remove the Structure Menu
      this.mMenuItems = [];

      // Do the Action and remove the tokens
      let data = this.mUnits[this.mSelectObject.index].useUnitAction(this.mActionTokens[i], this.mUnits, this.mStructures, this.mAPAmounts, this.mPopulationAmounts, this.kSpriteSheet, this.mSelectObject.team)
      this.mUnits = data[0];
      this.mStructures = data[1];
      this.mAPAmounts = data[2];
      this.mPopulationAmounts = data[3];

      this.mActionTokens = [];

      return;
    }
  }

  // If Mouse clicked a moveable unit
  for (let i = 0; i < this.mUnits.length; i++) {
    if (this.selectBox.pixelTouches(this.mUnits[i], h) && !this.mUnits[i].used) {
      // Remove the Structure Menu and Action Tokens
      this.mMenuItems = [];
      this.mActionTokens = [];

      // Save the Index of the Unit
      this.mSelectObject.index = i;
      this.mSelectObject.team = this.mUnits[i].team;

      // Select the Unit (Grows Slightly)
      this.mUnits[i].selectUnit();

      this.mUnits[i].findActions(this.mTiles, this.mUnits, this.mStructures, this.mActionTokens, this.kSpriteSheet, this.turn)
      return;
    }
  }

  // If Mouse clicked is a structure
  for (let i = 0; i < this.mStructures.length; i++) {
    if (this.selectBox.pixelTouches(this.mStructures[i], h)) {
      // Remove the Structure Menu
      this.mMenuItems = [];
      this.mActionTokens = [];

      // Save the Index of the Structure
      this.mSelectObject.index = i;
      this.mSelectObject.team = this.mStructures[i].team;

      // Select the Structure (Grows Slightly)
      this.mStructures[i].selectStructure();
      // Setup the Structure Menu
      this.setupStructMenu(this.mSelectObject.index);
      return;
    }
  }

  this.selectBox.getXform().setPosition(this.mResourceUICamera.mouseWCX(), this.mResourceUICamera.mouseWCY())
  if (this.selectBox.pixelTouches(this.mTurnCoin, h)) {
    // let data = this.mTurnCoin.giveResources(this.turn, this.mGoldAmounts, this.mKnowledgeAmounts, this.mStructures);
    let data = this.mTurnCoin.endTurn(this.turn, this.mUnits, this.mStructures, this.mGoldAmounts, this.mKnowledgeAmounts, this.mAPAmounts, this.teams);
    this.mUnits = data[0]
    this.turn = data[1]
    this.mGoldAmounts = data[2];
    this.mKnowledgeAmounts = data[3];
    this.mAPAmounts = data[4]



  }

  this.selectBox.getXform().setPosition(menuX, menuY)
  for (let i = 0; i < this.mMenuItems.length; i++) {
    if (this.cursorBox.pixelTouches(this.mMenuItems[i], h)) {
      let occupied = false;
      this.mUnits.forEach(u => {
        if (u.coX == this.mStructures[this.mSelectObject.index].coX && u.coY == this.mStructures[this.mSelectObject.index].coY) {
          occupied = true;
          return;
        }
      })


      if (occupied == false && this.mStructures[this.mSelectObject.index].team == this.turn && this.mPopulationAmounts[this.mStructures[this.mSelectObject.index].team - 1] >= 1 && this.mAPAmounts[this.turn - 1][0] > 0) {
        this.mUnits.push(new Unit(this.kSpriteSheet, null, this.mStructures[this.mSelectObject.index].getXform().getPosition()[0], this.mStructures[this.mSelectObject.index].getXform().getPosition()[1], this.mStructures[this.mSelectObject.index].coX, this.mStructures[this.mSelectObject.index].coY, this.mStructures[this.mSelectObject.index].num, this.mStructures[this.mSelectObject.index].team, this.mMenuItems[i].type, true, 1))

        if (this.mStructures[this.mSelectObject.index].team == 1) {
          this.mGoldAmounts[0] -= this.mMenuItems[i].price;
          this.mPopulationAmounts[0]--;
          this.mAPAmounts[0][0]--;

        } else if (this.mStructures[this.mSelectObject.index].team == 2) {
          this.mGoldAmounts[1] -= this.mMenuItems[i].price;
          this.mPopulationAmounts[0]--;
          this.mAPAmounts[1][0]--;
        }
      }

      this.mMenuItems = [];
      return;
    }
  }

  this.mActionTokens = []
  this.mMenuItems = [];
  this.mSelectObject.index = null;
  this.mSelectObject.team = null;

  return null;
}

MyGame.prototype.checkAdjacent = function (x, y, coX, coY) {

  if (x == coX && y == coY) {
    return true;
  }

  // Sideways Movement
  else if (y == coY) {
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

MyGame.prototype.checkDoubleAdjacent = function (x, y, coX, coY) {

  if (x == coX && y == coY) {
    return true;
  }

  // Sideways Movement
  if (y == coY) {
    if (x >= coX - 2 && x <= coX + 2) {
      return true;
    }
  }

  // Down Movement
  else if (y == coY + 1) {
    if (coY % 2 == 0) {
      if (x <= coX + 1 && x >= coX - 2) {
        return true;
      }
    } else {
      if (x >= coX - 1 && x <= coX + 2) {
        return true;
      }
    }
  }

  else if (y == coY + 2) {
    if (coY % 2 == 0) {
      if (x <= coX + 1 && x >= coX - 1) {
        return true;
      }
    } else {
      if (x >= coX - 1 && x <= coX + 1) {
        return true;
      }
    }
  }

  // Up Movement
  else if (y == coY - 1) {
    if (coY % 2 == 0) {
      if (x <= coX + 1 && x >= coX - 2) {
        return true;
      }
    } else {
      if (x >= coX - 1 && x <= coX + 2) {
        return true;
      }
    }
  }

  // Up Movement
  else if (y == coY - 2) {
    if (coY % 2 == 0) {
      if (x <= coX + 1 && x >= coX - 1) {
        return true;
      }
    } else {
      if (x >= coX - 1 && x <= coX + 1) {
        return true;
      }
    }
  }

  return false;
}