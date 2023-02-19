function Unit(spriteTexture, normalMap, atX, atY) {
  if (normalMap !== null) {
    this.mBuilder = new IllumRenderable(spriteTexture, normalMap);
  } else {
    this.mBuilder = new LightRenderable(spriteTexture);
  }
  this.mBuilder.setColor([1, 1, 1, 0]);
  this.mBuilder.getXform().setPosition(atX, atY);
  this.mBuilder.getXform().setSize(3, 3);
  this.mBuilder.setElementPixelPositions(0, 32, 98, 130);
  GameObject.call(this, this.mBuilder);
}
gEngine.Core.inheritPrototype(Unit, GameObject);

Unit.prototype.update = function () {
  if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left)) {
    if (this.mCamera.isMouseInViewport()) {
      console.log("Hello")
      this.mBuilder.getXform().setSize(4, 4);
    }

  }
}