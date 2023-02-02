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
  console.log(this.gameData)
  this.kSpriteSheet = "src/assets/img/SpriteSheet.png";

  this.mCamera = null;
  this.mMap = null;

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
  console.log(this.gameData)
  this.mMap = this.gameData;
  console.log(this.mMap)

  this.mGrassTile = new LightRenderable(this.kSpriteSheet);
  this.mGrassTile.getXform().setSize(10, 10);
  this.mGrassTile.getXform().setPosition(10, 65);
  this.mGrassTile.setElementPixelPositions(0, 64, 64, 0);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
  gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]);

  this.mCamera.setupViewProjection();
  this.mGrassTile.draw(this.mCamera);
  // this.mGrassTile.draw(this.mCamera.getVPMatrix());
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {

};