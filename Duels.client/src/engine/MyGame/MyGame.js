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
  this.mMapTiles = [];

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
    [0, 0, 640, 480]
  );
  this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
  this.mMap = this.gameData.terrainData.split("-");
  console.log(this.mMap)

  var x = 2;
  var y = 0;
  var r = 1;
  var pp = [];
  for (tile in this.mMap) {
    if (this.mMap[tile] == "l") {
      pp = [0, 64, 64, 0]
    } else if (this.mMap[tile] == "w") {
      pp = [64, 128, 64, 0]
    }


    this.mMapTiles.push(new LightRenderable(this.kSpriteSheet));
    this.mMapTiles[tile].getXform().setSize(10, 10);
    this.mMapTiles[tile].getXform().setPosition(x * 10 + 10, 68 - (y * 10));
    this.mMapTiles[tile].setElementPixelPositions(pp[0], pp[1], pp[2], pp[3]);
    x += 1;
    if (x > 5 && r == 1 || x > 6 && r == 3) {
      y += 0.75;
      x = 1.5;
      r++;
    } else if (x > 6 && r == 2) {
      y += 0.75;
      x = 1;
      r++
    } else if (x > 6 && r == 4) {
      y += 0.75;
      x = 2;
      r++
    }
  }

};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
  gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]);

  this.mCamera.setupViewProjection();

  for (tile in this.mMapTiles) {
    this.mMapTiles[tile].draw(this.mCamera);
  }

  // this.mGrassTile.draw(this.mCamera.getVPMatrix());
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {

};