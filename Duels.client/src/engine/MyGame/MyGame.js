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
  this.gameData = gameData;
  this.kSpriteSheet = "src/assets/img/SpriteSheet.png";

  this.mCamera = null;
  this.mMap = null;
  this.mStructs = null;
  this.mTroops = null;
  this.mMapTiles = [];
  this.mUnits = [];
  this.mStructures = [];

}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
  gEngine.Textures.loadTexture(this.kSpriteSheet);
};

MyGame.prototype.unloadScene = function () {
  gEngine.Textures.unloadTexture(this.kSpriteSheet);
};

MyGame.prototype.initialize = function () {

  gEngine.DefaultResources.setGlobalAmbientIntensity(3)

  this.mCamera = new Camera(
    vec2.fromValues(50, 36),
    100,
    [0, 0, 1366, 768]
  );
  this.mCamera.setBackgroundColor([0.796, 0.796, 0.796, 1.0]);// [0.05, 0.02, 0.06, 1.0]

  this.mMap = this.gameData.terrainData.split("-");
  this.mStructs = this.gameData.structureData.split("-");
  this.mTroops = this.gameData.troopData.split("-");


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
  gEngine.Core.clearCanvas([0, 0, 0, 1.0]);

  this.mCamera.setupViewProjection();

  for (tile in this.mMapTiles) {
    this.mMapTiles[tile].draw(this.mCamera);
  }

  for (struct in this.mStructures) {
    this.mStructures[struct].draw(this.mCamera)
  }

  for (unit in this.mUnits) {
    this.mUnits[unit].draw(this.mCamera)
  }



};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {

};

// Create a list of tiles in the map
MyGame.prototype.createHexMap = function () {
  var x = 2.5;
  var y = 0;
  var r = 1;
  var pp = [];
  for (tile in this.mMap) {
    if (this.mMap[tile] == "l") {
      pp = [0, 64, 164, 228]
    } else if (this.mMap[tile] == "w") {
      pp = [64, 128, 164, 228]
    }

    this.mMapTiles.push(new LightRenderable(this.kSpriteSheet));
    this.mMapTiles[tile].getXform().setSize(9, 9);
    this.mMapTiles[tile].getXform().setPosition(x * 8.8 + 12, 56.5 - (y * 10));
    this.mMapTiles[tile].setElementPixelPositions(pp[0], pp[1], pp[2], pp[3]);

    if (this.mStructs[tile].substr(1) == "th") {
      this.mStructures.push(new LightRenderable(this.kSpriteSheet));
      this.mStructures[this.mStructures.length - 1].getXform().setSize(7, 7);
      this.mStructures[this.mStructures.length - 1].getXform().setPosition(x * 8.8 + 12, 57 - (y * 10));
      this.mStructures[this.mStructures.length - 1].setElementPixelPositions(0, 35, 67, 99);
    }

    if (this.mTroops[tile].substr(1) == "b") {
      this.mUnits.push(new LightRenderable(this.kSpriteSheet));
      this.mUnits[this.mUnits.length - 1].getXform().setSize(3, 3);
      this.mUnits[this.mUnits.length - 1].getXform().setPosition(x * 8.8 + 12.25, 56.6 - (y * 10));
      this.mUnits[this.mUnits.length - 1].setElementPixelPositions(0, 35, 132, 164);
    }

    x += 1;
    if (x > 6 && r == 1 || x > 7 && r == 5) {
      y += 0.68;
      x = 2;
      r++;
    } else if (x > 6 && r == 2 || x > 7 && r == 4) {
      y += 0.68;
      x = 1.5;
      r++
    } else if (x > 7 && r == 3) {
      y += 0.68;
      x = 1;
      r++;
    } else if (x > 6 && r == 6) {
      y += 0.68;
      x = 2.5;
      r++;
    }





  }
}

