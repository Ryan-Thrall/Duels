function MouseSelect(spriteTexture, normalMap, atX, atY) {

  if (normalMap !== null) {
    this.selectBox = new IllumRenderable(spriteTexture, normalMap);
  } else {
    this.selectBox = new LightRenderable(spriteTexture);
  }
  this.selectBox.setColor([1, 1, 1, 0]);
  this.selectBox.getXform().setPosition(atX, atY);
  this.selectBox.getXform().setSize(0.1, 0.1);
  this.selectBox.setElementPixelPositions(0, 35, 132, 164);
  GameObject.call(this, this.selectBox);

  // this.selectBox = new Renderable();
  // this.selectBox.setColor([0, 0, 0, 1]);
  // this.selectBox.getXform().setSize(11, 11);
  // this.selectBox.getXform().setPosition(15, 15)
  // GameObject.call(this, this.selectBox);
}
gEngine.Core.inheritPrototype(MouseSelect, GameObject);