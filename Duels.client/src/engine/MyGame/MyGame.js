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

  // UI for Gold amounts
  this.mRedCoin = null;
  this.mRedText = null;

  this.mBlueCoin = null;
  this.mBlueText = null;

  // Holds the Action Token Objects
  this.mActionTokens = [];

  // Holds the menu items in the structure menu
  this.mMenuItems = [];

  // The Variable for the selected unit or structure, and the tile
  this.mSelectIndex = null;

  // A tiny sprite used to check for collisions with mouse clicks and mouse hovers
  this.selectBox = null;
  this.cursorBox = null;

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
    [0, 568, 200, 200]
  );
  this.mResourceUICamera.setBackgroundColor([0.4, 0.4, 0.4, 1.0]);

  // Initial Setup of the Structure Menu Camera
  this.mStructureMenuCamera = new Camera(vec2.fromValues(50, 36),
    100,
    [0, 0, 200, 568]
  );
  this.mStructureMenuCamera.setBackgroundColor([0.4, 0.4, 0.4, 1.0]);

  // Turn the given string data into an array of data
  this.mMapData = this.gameData.terrainData.split("-");
  this.mStructData = this.gameData.structureData.split("-");
  this.mUnitData = this.gameData.troopData.split("-");

  // Setup the mouse detection sprites
  this.selectBox = new MouseSelect(this.kSpriteSheet, null, 0, 0);
  this.cursorBox = new MouseSelect(this.kSpriteSheet, null, 0, 0);

  // Setup Resource UI
  this.setupResourceUI();

  // Setup initial positions on the board
  this.createHexMap();
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
  this.mRedText.draw(this.mResourceUICamera);

  // Draw the Blue UI Info
  this.mBlueCoin.draw(this.mResourceUICamera);
  this.mBlueText.draw(this.mResourceUICamera);

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


  // FIXME Figure out this stupid zoom system and why WCWidth Will never update even when told to update
  // if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Q)) {
  //   this.mCamera.zoomBy(1 - 0.05);
  // }
  // if (gEngine.Input.isKeyPressed(gEngine.Input.keys.E)) {
  //   cameraPos[0] -= 5;
  //   this.mCamera.setViewport(cameraPos);
  // }


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
  this.mRedCoin = new LightRenderable(this.kSpriteSheet);
  this.mRedCoin.getXform().setSize(20, 20);
  this.mRedCoin.getXform().setPosition(12, 60);
  this.mRedCoin.setElementPixelPositions(313, 345, 0, 32);

  this.mRedText = new FontRenderable("x " + this.mGoldAmounts[0]);
  this.mRedText.setColor([0, 0, 0, 1]);
  this.mRedText.getXform().setPosition(28, 60);
  this.mRedText.setTextHeight(15);

  this.mBlueCoin = new LightRenderable(this.kSpriteSheet);
  this.mBlueCoin.getXform().setSize(20, 20);
  this.mBlueCoin.getXform().setPosition(12, 30);
  this.mBlueCoin.setElementPixelPositions(346, 378, 0, 32);

  this.mBlueText = new FontRenderable("x " + this.mGoldAmounts[1]);
  this.mBlueText.setColor([0, 0, 0, 1]);
  this.mBlueText.getXform().setPosition(28, 32);
  this.mBlueText.setTextHeight(15);
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

  this.mMenuItems.push(new MenuItem(this.kSpriteSheet, null, 13, 165, [pp[0], pp[1], 230, 262], 1, "Swordsman"));
  this.mMenuItems.push(new MenuItem(this.kSpriteSheet, null, 13, 134, [pp[0], pp[1], 197, 229], 2, "General"));
  this.mMenuItems.push(new MenuItem(this.kSpriteSheet, null, 13, 103, [pp[0], pp[1], 164, 196], 3, "Archer"));
  this.mMenuItems.push(new MenuItem(this.kSpriteSheet, null, 13, 72, [pp[0], pp[1], 131, 163], 4, "Shieldman"));
  this.mMenuItems.push(new MenuItem(this.kSpriteSheet, null, 13, 41, [pp[0], pp[1], 98, 130], 5, "Cavalry"));
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
      pp = [0, 55, 0, 64];
      terrain = "p"
    } else if (this.mMapData[tile][0] == "w") {
      pp = [56, 111, 0, 64]
      terrain = "w"
    } else if (this.mMapData[tile][0] == "h") {
      pp = [112, 167, 0, 64]
      terrain = "h"
    } else if (this.mMapData[tile][0] == "f") {
      pp = [168, 223, 0, 64]
      terrain = "f"
    }

    // Create the new tile
    this.mTiles.push(new Tile(this.kSpriteSheet, null, x * 8.8 + 24, 56.5 - (y * 10), pp, coX, coY, terrain));

    // Select the row of the spritesheet based off player color
    if (this.mStructData[tile].substr(0, 1) == "1") {
      pp = [0, 32, 0, 0];
      team = 1;
    } else if (this.mStructData[tile].substr(0, 1) == "2") {
      pp = [34, 66, 0, 0];
      team = 2;
    }

    // Add a townhall structure if on this tile
    if (this.mStructData[tile].substr(1) == "hb") {
      pp[2] = 65;
      pp[3] = 97;

      this.mStructures.push(new Structure(this.kSpriteSheet, null, x * 8.8 + 24, 56.5 - (y * 10), pp, coX, coY, team, "base"));
      // this.mStructures[this.mStructures.length - 1].getXform().setSize(5.8, 5.8);
      // this.mStructures[this.mStructures.length - 1].getXform().setPosition(x * 8.8 + 24, 56.5 - (y * 10));
      // this.mStructures[this.mStructures.length - 1].setElementPixelPositions(pp[0], pp[1], pp[2], pp[3]);
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
      this.mUnits = this.mUnits[this.mSelectIndex].useUnitAction(this.mActionTokens[i], this.mUnits, this.mGoldAmounts, this.mRedText, this.mBlueText)
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

      this.mUnits[i].findMoves(this.mTiles, this.mUnits, this.mActionTokens, this.kSpriteSheet)
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

  // console.log(this.selectBox.getXform().getPosition())
  this.selectBox.getXform().setPosition(menuX, menuY)
  // console.log(this.selectBox.getXform().getPosition())
  for (let i = 0; i < this.mMenuItems.length; i++) {
    // console.log("WOOOO")
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


      if (occupied == false && this.mGoldAmounts[this.mStructures[this.mSelectIndex].team - 1] >= this.mMenuItems[i].price) {
        this.mUnits.push(new Unit(this.kSpriteSheet, null, this.mStructures[this.mSelectIndex].getXform().getPosition()[0], this.mStructures[this.mSelectIndex].getXform().getPosition()[1], this.mStructures[this.mSelectIndex].coX, this.mStructures[this.mSelectIndex].coY, this.mStructures[this.mSelectIndex].team, this.mMenuItems[i].type))

        if (this.mStructures[this.mSelectIndex].team == 1) {
          this.mGoldAmounts[0] -= this.mMenuItems[i].price;
          this.mRedText.setText("x " + this.mGoldAmounts[0])
        } else if (this.mStructures[this.mSelectIndex].team == 2) {
          this.mGoldAmounts[1] -= this.mMenuItems[i].price;
          this.mBlueText.setText("x " + this.mGoldAmounts[1])
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

// MyGame.prototype.useUnitAction = function (moveToken, i) {

//   if (moveToken.type == "Move") {
//     this.mUnits[i].updateCoords(moveToken.coX, moveToken.coY)
//     this.mUnits[i].getXform().setPosition(moveToken.getXform().getPosition()[0], moveToken.getXform().getPosition()[1]);
//     this.mActionTokens = [];
//     return;
//   }
//   else if (moveToken.type == "Attack") {
//     this.mUnits = this.mUnits.filter(unit => (unit.coX != moveToken.coX || unit.coY != moveToken.coY))
//     this.mActionTokens = [];
//   }

// }

// MyGame.prototype.findMoves = function (coX, coY, team) {
//   let noMove = false;
//   this.mTiles.forEach(tile => {
//     let y = tile.coY;
//     let x = tile.coX;
//     if (tile.checkAdjacent(x, y, coX, coY) && tile.terrain != "b") {


//       this.mUnits.forEach(unit => {
//         if (unit.coX == x && unit.coY == y) {
//           if (unit.team == team) {
//             noMove = true
//             return;
//           } else if (unit.team != team) {
//             this.mActionTokens.push(new ActionToken(this.kSpriteSheet, null, tile.getXform().getPosition()[0], tile.getXform().getPosition()[1], x, y, "Attack"))
//             noMove = true;
//             return;
//           }
//         }


//       })

//       if (!noMove) {
//         this.mActionTokens.push(new ActionToken(this.kSpriteSheet, null, tile.getXform().getPosition()[0], tile.getXform().getPosition()[1], x, y, "Move"))
//       }

//       noMove = false;
//     }
//   })


// }

