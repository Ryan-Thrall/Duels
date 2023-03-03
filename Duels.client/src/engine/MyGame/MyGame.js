/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */



/*jslint node: true, vars: true, white: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  Renderable, TextureRenderable, FontRenderable, SpriteRenderable, LightRenderable, IllumRenderable,
  GameObject, TiledGameObject, ParallaxGameObject, Hero, Minion, Dye, Light */
/* find out more about jslint: http://www.jslint.com/help.html */



// import { AppState } from "../../AppState.js";

// Operate in Strict mode such that variables must be declared before used!

const { mat2, mat2d, mat4, mat3, quat, quat2, vec2, vec3, vec4 } = glMatrix;

function MyGame(gameData) {
  // Current Game Data
  this.gameData = gameData;

  // The Spritesheet
  this.kSpriteSheet = "src/assets/img/SpriteSheet.png";


  // The main Camera
  this.mCamera = null;

  this.mResourceUICamera = null;

  this.mStructureMenuCamera = null;

  // The Map Struct and Unit Data
  this.mMapData = null;
  this.mStructData = null;
  this.mUnitData = null;

  // The Arrays to Hold the Objects made from the data
  this.mTiles = [];
  this.mUnits = [];
  this.mStructures = [];

  // Holds Gold Levels of all Players
  this.mGoldAmounts = [0, 0];
  this.mKnowledgeAmounts = [0, 0];
  this.mHousingAmounts = [1, 3, 1, 3];

  // UI for Game Info
  this.mRedCoin = null;
  this.mRedGoldText = null;

  this.mRedKnowledge = null;
  this.mRedKnowledgeText = null;

  this.mRedHousing = null;
  this.mRedHousingText = null;

  this.mBlueCoin = null;
  this.mBlueGoldText = null;

  this.mBlueKnowledge = null;
  this.mBlueKnowledgeText = null;

  this.mBlueHousing = null;
  this.mBlueHousingText = null;


  this.mTurnCoin = null;

  // Holds the Action Token Objects
  this.mActionTokens = [];

  // Holds the menu items in the structure menu
  this.mMenuItems = [];

  // The Variable for the selected unit or structure, and the tile
  this.mSelectIndex = null;

  // A tiny sprite used to check for collisions with mouse clicks and mouse hovers
  this.selectBox = null;
  this.cursorBox = null;

  // Tracks which players turn it is
  this.teams = [];
  this.turn = null;

}
gEngine.Core.inheritPrototype(MyGame, Scene);

// Load the spritesheet
MyGame.prototype.loadScene = function () {
  gEngine.Textures.loadTexture(this.kSpriteSheet);
};

// Unload the spritesheet
MyGame.prototype.unloadScene = function () {
  gEngine.Textures.unloadTexture(this.kSpriteSheet);
};

// Initial Setup
MyGame.prototype.initialize = function () {

  // FIXME Fixes Brightness Bug (May Find Better Solution Later)
  gEngine.DefaultResources.setGlobalAmbientIntensity(3.5)

  // Initial Setup of the camera
  this.mCamera = new Camera(
    vec2.fromValues(50, 36),
    125,
    [0, 0, 1366, 768]
  );
  this.mCamera.setBackgroundColor([0.796, 0.796, 0.796, 1.0]);// [0.05, 0.02, 0.06, 1.0]

  // Initial Setup of the Resource Camera
  this.mResourceUICamera = new Camera(
    vec2.fromValues(50, 36),
    100,
    [0, 408, 200, 360]
  );
  this.mResourceUICamera.setBackgroundColor([0.4, 0.4, 0.4, 1.0]);

  // Initial Setup of the Structure Menu Camera
  this.mStructureMenuCamera = new Camera(vec2.fromValues(50, 36),
    100,
    [0, 0, 200, 408]
  );
  this.mStructureMenuCamera.setBackgroundColor([0.4, 0.4, 0.4, 1.0]);

  // Turn the given string data into an array of data
  this.mMapData = this.gameData.terrainData.split("-");
  this.mStructData = this.gameData.structureData.split("-");
  this.mUnitData = this.gameData.troopData.split("-");

  // Setup the mouse detection sprites
  this.selectBox = new MouseSelect(this.kSpriteSheet, null, 0, 0);
  this.cursorBox = new MouseSelect(this.kSpriteSheet, null, 0, 0);

  // Setup initial positions on the board
  this.createHexMap();

  this.turn = this.teams[0]

  // Setup Resource UI
  this.setupResourceUI();






};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
  // Clear the canvas to the default color
  gEngine.Core.clearCanvas([0.796, 0.796, 0.796, 1.0]);

  // Setup the main camera
  this.mCamera.setupViewProjection();


  // Draw the tiles
  for (tile in this.mTiles) {
    this.mTiles[tile].draw(this.mCamera);
  }

  // Draw the structures
  for (struct in this.mStructures) {
    this.mStructures[struct].draw(this.mCamera)
  }

  // Draw the Units
  for (unit in this.mUnits) {
    this.mUnits[unit].draw(this.mCamera)
  }

  // Draw the action tokens
  for (token in this.mActionTokens) {
    this.mActionTokens[token].draw(this.mCamera)
  }

  // Setup the Resource Camera
  this.mResourceUICamera.setupViewProjection();

  // Draw the Red UI Info
  this.mRedCoin.draw(this.mResourceUICamera);
  this.mRedGoldText.draw(this.mResourceUICamera);

  this.mRedKnowledge.draw(this.mResourceUICamera)
  this.mRedKnowledgeText.draw(this.mResourceUICamera)

  this.mRedHousing.draw(this.mResourceUICamera)
  this.mRedHousingText.draw(this.mResourceUICamera)

  // Draw the Blue UI Info
  this.mBlueCoin.draw(this.mResourceUICamera);
  this.mBlueGoldText.draw(this.mResourceUICamera);

  this.mBlueKnowledge.draw(this.mResourceUICamera)
  this.mBlueKnowledgeText.draw(this.mResourceUICamera)

  this.mBlueHousing.draw(this.mResourceUICamera)
  this.mBlueHousingText.draw(this.mResourceUICamera)

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

  this.mRedGoldText.setText("x " + this.mGoldAmounts[0])
  this.mRedKnowledgeText.setText("x " + this.mKnowledgeAmounts[0])
  this.mRedHousingText.setText("x " + this.mHousingAmounts[0] + "/" + this.mHousingAmounts[1])
  this.mBlueGoldText.setText("x " + this.mGoldAmounts[1])
  this.mBlueKnowledgeText.setText("x " + this.mKnowledgeAmounts[1])
  this.mBlueHousingText.setText("x " + this.mHousingAmounts[2] + "/" + this.mHousingAmounts[3])
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
    let box;
    let cBox;
    let size = this.mMenuItems[i].menuItem.getObjectAt(0).getXform().getSize()
    let cSize = this.cursorBox.getXform().getSize()
    let pos = this.mMenuItems[i].menuItem.getObjectAt(0).getXform().getPosition()
    let cPos = this.cursorBox.getXform().getPosition()
    box = [pos[0] - (size[0] / 2), pos[0] + (size[0] / 2), pos[1] + (size[1] / 2), pos[1] - (size[1] / 2)]
    cBox = [cPos[0], cPos[0] + cSize[0], cPos[1], cPos[1] - cSize[1]]
    if (cBox[1] > box[0] && cBox[1] < box[1] && cBox[2] > box[3] && cBox[3] < box[2]) {
      document.body.style.cursor = "pointer"
    }


  }
}

MyGame.prototype.setupResourceUI = function () {
  // Setup Resource UI

  this.mTurnCoin = new TurnCoin(this.kSpriteSheet, null, 46.5, 110, this.turn);


  this.mRedCoin = new LightRenderable(this.kSpriteSheet);
  this.mRedCoin.getXform().setSize(20, 20);
  this.mRedCoin.getXform().setPosition(12, 80);
  this.mRedCoin.setElementPixelPositions(313, 345, 0, 32);

  this.mRedGoldText = new FontRenderable("x " + this.mGoldAmounts[0]);
  this.mRedGoldText.setColor([0, 0, 0, 1]);
  this.mRedGoldText.getXform().setPosition(28, 82);
  this.mRedGoldText.setTextHeight(15);

  this.mRedKnowledge = new LightRenderable(this.kSpriteSheet);
  this.mRedKnowledge.getXform().setSize(20, 20);
  this.mRedKnowledge.getXform().setPosition(12, 58);
  this.mRedKnowledge.setElementPixelPositions(313, 345, 33, 65);

  this.mRedKnowledgeText = new FontRenderable("x " + this.mKnowledgeAmounts[0]);
  this.mRedKnowledgeText.setColor([0, 0, 0, 1]);
  this.mRedKnowledgeText.getXform().setPosition(28, 60);
  this.mRedKnowledgeText.setTextHeight(15);

  this.mRedHousing = new LightRenderable(this.kSpriteSheet);
  this.mRedHousing.getXform().setSize(20, 20);
  this.mRedHousing.getXform().setPosition(12, 38);
  this.mRedHousing.setElementPixelPositions(313, 345, 66, 98);

  this.mRedHousingText = new FontRenderable("x " + this.mHousingAmounts[0] + "/" + this.mHousingAmounts[1]);
  this.mRedHousingText.setColor([0, 0, 0, 1]);
  this.mRedHousingText.getXform().setPosition(28, 40);
  this.mRedHousingText.setTextHeight(15);

  this.mBlueCoin = new LightRenderable(this.kSpriteSheet);
  this.mBlueCoin.getXform().setSize(20, 20);
  this.mBlueCoin.getXform().setPosition(12, 16);
  this.mBlueCoin.setElementPixelPositions(346, 378, 0, 32);

  this.mBlueGoldText = new FontRenderable("x " + this.mGoldAmounts[1]);
  this.mBlueGoldText.setColor([0, 0, 0, 1]);
  this.mBlueGoldText.getXform().setPosition(28, 18);
  this.mBlueGoldText.setTextHeight(15);

  this.mBlueKnowledge = new LightRenderable(this.kSpriteSheet);
  this.mBlueKnowledge.getXform().setSize(20, 20);
  this.mBlueKnowledge.getXform().setPosition(12, -6);
  this.mBlueKnowledge.setElementPixelPositions(346, 378, 33, 65);

  this.mBlueKnowledgeText = new FontRenderable("x " + this.mKnowledgeAmounts[1]);
  this.mBlueKnowledgeText.setColor([0, 0, 0, 1]);
  this.mBlueKnowledgeText.getXform().setPosition(28, -4);
  this.mBlueKnowledgeText.setTextHeight(15);

  this.mBlueHousing = new LightRenderable(this.kSpriteSheet);
  this.mBlueHousing.getXform().setSize(20, 20);
  this.mBlueHousing.getXform().setPosition(12, -28);
  this.mBlueHousing.setElementPixelPositions(346, 378, 66, 98);

  this.mBlueHousingText = new FontRenderable("x " + this.mHousingAmounts[0] + "/" + this.mHousingAmounts[1]);
  this.mBlueHousingText.setColor([0, 0, 0, 1]);
  this.mBlueHousingText.getXform().setPosition(28, -26);
  this.mBlueHousingText.setTextHeight(15);
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

  this.mMenuItems.push(new MenuItem(this.kSpriteSheet, null, 13, 124, [pp[0], pp[1], 230, 262], 1, "Swordsman"));
  this.mMenuItems.push(new MenuItem(this.kSpriteSheet, null, 13, 93, [pp[0], pp[1], 197, 229], 2, "General"));
  this.mMenuItems.push(new MenuItem(this.kSpriteSheet, null, 13, 62, [pp[0], pp[1], 164, 196], 3, "Archer"));
  this.mMenuItems.push(new MenuItem(this.kSpriteSheet, null, 13, 31, [pp[0], pp[1], 131, 163], 4, "Shieldman"));
  this.mMenuItems.push(new MenuItem(this.kSpriteSheet, null, 13, 0, [pp[0], pp[1], 98, 130], 5, "Cavalry"));
}

// Create a list of tiles in the map
MyGame.prototype.createHexMap = function () {
  // Grid Coordinates
  var coX = 0;
  var coY = 0;

  // Terrain type
  var terrain = "";

  // Drawing Coordinates
  var x = 0;
  var y = 0;

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
    this.mTiles.push(new Tile(this.kSpriteSheet, null, x * 8.8 + 24, 56.5 - (y * 10), coX, coY, terrain));

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

      this.mStructures.push(new Structure(this.kSpriteSheet, null, x * 8.8 + 24, 56.5 - (y * 10), coX, coY, team, "humanBase"));
    }

    // Add a unit if on this tile
    if (this.mUnitData[tile].substr(1) == "hs") {
      this.mUnits.push(new Unit(this.kSpriteSheet, null, x * 8.8 + 24, 56.5 - (y * 10), coX, coY, team, "Swordsman"));
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
      let data = this.mUnits[this.mSelectIndex].useUnitAction(this.mActionTokens[i], this.mUnits, this.mStructures, this.kSpriteSheet)
      console.log(data)
      this.mUnits = data[0];
      this.mStructures = data[1];
      // this.mHousingAmounts = data[2];

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
      this.mSelectIndex = i;

      // Select the Unit (Grows Slightly)
      this.mUnits[i].selectUnit();

      this.mUnits[i].findMoves(this.mTiles, this.mUnits, this.mStructures, this.mActionTokens, this.kSpriteSheet, this.turn)
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
      this.mSelectIndex = i;

      // Select the Structure (Grows Slightly)
      this.mStructures[i].selectStructure();
      // Setup the Structure Menu
      this.setupStructMenu(this.mSelectIndex);
      return;
    }
  }

  this.selectBox.getXform().setPosition(this.mResourceUICamera.mouseWCX(), this.mResourceUICamera.mouseWCY())
  if (this.selectBox.pixelTouches(this.mTurnCoin, h)) {
    // let data = this.mTurnCoin.giveResources(this.turn, this.mGoldAmounts, this.mKnowledgeAmounts, this.mStructures);
    let data = this.mTurnCoin.endTurn(this.turn, this.mUnits, this.mStructures, this.mGoldAmounts, this.mKnowledgeAmounts, this.teams);
    this.mUnits = data[0]
    this.turn = data[1]
    this.mGoldAmounts = data[2];
    this.mKnowledgeAmounts = data[3];



  }

  this.selectBox.getXform().setPosition(menuX, menuY)
  for (let i = 0; i < this.mMenuItems.length; i++) {
    let box;
    let cBox;
    let size = this.mMenuItems[i].menuItem.getObjectAt(0).getXform().getSize()
    let cSize = this.selectBox.getXform().getSize()
    let pos = this.mMenuItems[i].menuItem.getObjectAt(0).getXform().getPosition()
    let cPos = this.selectBox.getXform().getPosition()
    box = [pos[0] - (size[0] / 2), pos[0] + (size[0] / 2), pos[1] + (size[1] / 2), pos[1] - (size[1] / 2)]
    cBox = [cPos[0], cPos[0] + cSize[0], cPos[1], cPos[1] - cSize[1]]
    if (cBox[1] > box[0] && cBox[1] < box[1] && cBox[2] > box[3] && cBox[3] < box[2]) {

      let occupied = false;
      this.mUnits.forEach(u => {
        if (u.coX == this.mStructures[this.mSelectIndex].coX && u.coY == this.mStructures[this.mSelectIndex].coY) {
          occupied = true;
          return;
        }
      })


      if (occupied == false && this.mGoldAmounts[this.mStructures[this.mSelectIndex].team - 1] >= this.mMenuItems[i].price && this.mStructures[this.mSelectIndex].team == this.turn) {
        this.mUnits.push(new Unit(this.kSpriteSheet, null, this.mStructures[this.mSelectIndex].getXform().getPosition()[0], this.mStructures[this.mSelectIndex].getXform().getPosition()[1], this.mStructures[this.mSelectIndex].coX, this.mStructures[this.mSelectIndex].coY, this.mStructures[this.mSelectIndex].team, this.mMenuItems[i].type, true))

        if (this.mStructures[this.mSelectIndex].team == 1) {
          this.mGoldAmounts[0] -= this.mMenuItems[i].price;

        } else if (this.mStructures[this.mSelectIndex].team == 2) {
          this.mGoldAmounts[1] -= this.mMenuItems[i].price;
        }
      }

      this.mMenuItems = [];
      return;
    }
  }

  this.mActionTokens = []
  this.mMenuItems = [];
  this.mSelectIndex = null;

  return null;
}

