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

  // The Map Struct and Unit Data
  this.mMapData = null;
  this.mStructData = null;
  this.mUnitData = null;

  // The Arrays to Hold the Objects made from the data
  this.mTiles = [];
  this.tile = null;

  this.mUnits = [];
  this.unit = null;

  this.mStructures = [];

  // Holds the Move Token Objects
  this.mMoveTokens = [];

  // The Variable for the selected unit or structure, and the tile
  this.mUnitIndex = null;
  this.mTile = null

  // A tiny sprite used to check for collisions with mouse clicks
  this.selectBox = null;

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

  this.mMapData = this.gameData.terrainData.split("-");
  this.mStructData = this.gameData.structureData.split("-");
  this.mUnitData = this.gameData.troopData.split("-");

  this.selectBox = new MouseSelect(this.kSpriteSheet, null, 15, 15);




  this.createHexMap();

  // this.mStructures.push(new LightRenderable(this.kSpriteSheet));
  // this.mStructures[0].getXform().setSize(7, 7);
  // this.mStructures[0].getXform().setPosition(45, 15.5);
  // this.mStructures[0].setElementPixelPositions(0, 35, 67, 99);

  // this.mUnits.push(new LightRenderable(this.kSpriteSheet));
  // this.mUnits[0].getXform().setSize(3, 3);
  // this.mUnits[0].getXform().setPosition(35, 15);
  // this.mUnits[0].setElementPixelPositions(0, 35, 132, 164);

};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
  gEngine.Core.clearCanvas([0.796, 0.796, 0.796, 1.0]);

  this.mCamera.setupViewProjection();

  for (tile in this.mTiles) {
    this.mTiles[tile].draw(this.mCamera);
  }

  for (struct in this.mStructures) {
    this.mStructures[struct].draw(this.mCamera)
  }

  for (unit in this.mUnits) {
    this.mUnits[unit].draw(this.mCamera)
  }

  for (token in this.mMoveTokens) {
    this.mMoveTokens[token].draw(this.mCamera)
  }

  this.selectBox.draw(this.mCamera)


};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
  let cameraPos = this.mCamera.getViewport();
  // console.log(cameraPos)


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
  // FIXME Figure out this stupid zoom system and why WCWidth Will never update even when told to update
  // if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Q)) {
  //   // console.log("zooom")
  //   this.mCamera.zoomBy(1 - 0.05);
  //   console.log(this.mCamera.getWCWidth())
  // }
  // if (gEngine.Input.isKeyPressed(gEngine.Input.keys.E)) {
  //   cameraPos[0] -= 5;
  //   this.mCamera.setViewport(cameraPos);
  // }


  // If Mouse is left clicked on canvas
  if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left)) {
    if (this.mCamera.isMouseInViewport()) {
      // console.log(this.mCamera.mouseWCX())
      this.mUnits.forEach(u => {
        u.getXform().setSize(5, 5)
      })
      this.checkMouseSelect(this.mCamera.mouseWCX(), this.mCamera.mouseWCY())
    }
  };
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
  var ppX = 0;

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
    // this.mTiles[tile].getXform().setSize(9, 9);
    // this.mTiles[tile].getXform().setPosition(x * 8.8 + 24, 56.5 - (y * 10));
    // this.mTiles[tile].setElementPixelPositions(pp[0], pp[1], pp[2], pp[3]);

    // Select the row of the spritesheet based off player color
    if (this.mStructData[tile].substr(0, 1) == "1") {
      ppX = 0;
    } else if (this.mStructData[tile].substr(0, 1) == "2") {
      ppX = 33;
    }

    // Add a townhall structure if on this tile
    if (this.mStructData[tile].substr(1) == "hb") {
      this.mStructures.push(new LightRenderable(this.kSpriteSheet));
      this.mStructures[this.mStructures.length - 1].getXform().setSize(5.8, 5.8);
      this.mStructures[this.mStructures.length - 1].getXform().setPosition(x * 8.8 + 24, 56.5 - (y * 10));
      this.mStructures[this.mStructures.length - 1].setElementPixelPositions(ppX, ppX + 32, 131, 163);
    }

    // Add a unit if on this tile
    if (this.mUnitData[tile].substr(1) == "b") {
      this.mUnits.push(new Unit(this.kSpriteSheet, null, x * 8.8 + 24, 56.5 - (y * 10), ppX, coX, coY));
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

    // if (x > 6 && r == 1 || x > 7 && r == 5) {
    //   y += 0.68;
    //   x = 2;
    //   r++;
    // } else if (x > 6 && r == 2 || x > 7 && r == 4) {
    //   y += 0.68;
    //   x = 1.5;
    //   r++
    // } else if (x > 7 && r == 3) {
    //   y += 0.68;
    //   x = 1;
    //   r++;
    // } else if (x > 6 && r == 6) {
    //   y += 0.68;
    //   x = 2.5;
    //   r++;
    // }





  }
}

MyGame.prototype.checkMouseSelect = function (mouseX, mouseY) {
  // console.log(mouseX, mouseY)
  let h = []
  this.selectBox.getXform().setPosition(mouseX, mouseY)

  for (let i = 0; i < this.mUnits.length; i++) {
    if (this.selectBox.pixelTouches(this.mUnits[i], h)) {
      this.mUnitIndex = i;
      this.mUnits[i].selectUnit();
      this.findAdjacentTiles(this.mUnits[i].unit.coX, this.mUnits[i].unit.coY)
      return;
    }
  }

  for (let i = 0; i < this.mMoveTokens.length; i++) {
    if (this.selectBox.pixelTouches(this.mMoveTokens[i], h)) {
      this.moveUnit(this.mMoveTokens[i], this.mUnitIndex)
      return;
    }
  }

  this.mMoveTokens = []
  this.mUnitIndex = null;

  return null;

  // console.log(this.selectBox.pixelTouches(this.mUnits[1], h))
  // this.mUnits[0].pixelTouches(mouseX, mouseY)
}

MyGame.prototype.moveUnit = function (moveToken, i) {
  this.mUnits[i].updateCoords(moveToken.token.coX, moveToken.token.coY)
  // this.mUnits[i].unit.coY = moveToken.token.coY;
  this.mUnits[i].getXform().setPosition(moveToken.getXform().getPosition()[0], moveToken.getXform().getPosition()[1]);
  this.mMoveTokens = [];
}

MyGame.prototype.findAdjacentTiles = function (coX, coY) {
  this.mTiles.forEach(tile => {
    let y = tile.tile.coY;
    let x = tile.tile.coX;
    if (this.checkAdjacent(x, y, coX, coY) && tile.tile.terrain != "b") {
      this.mMoveTokens.push(new MoveToken(this.kSpriteSheet, null, tile.getXform().getPosition()[0], tile.getXform().getPosition()[1], x, y))
      // console.log(tile.getXform().getPosition()[0])
    }
  })


}

MyGame.prototype.checkAdjacent = function (x, y, coX, coY) {
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