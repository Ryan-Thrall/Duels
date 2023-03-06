

function MenuItem(spriteTexture, normalMap, atX, atY, pp, price, type) {

  if (normalMap !== null) {
    this.menuItem = new IllumRenderable(spriteTexture, normalMap);
  } else {
    this.menuItem = new LightRenderable(spriteTexture);
  }

  this.menuItem.setColor([1, 1, 1, 0]);
  this.menuItem.getXform().setPosition(atX, atY);
  this.menuItem.getXform().setSize(30, 30);
  this.menuItem.setElementPixelPositions(pp[0], pp[1], pp[2], pp[3])

  this.type = type;
  this.price = price;


  GameObject.call(this, this.menuItem);
}
gEngine.Core.inheritPrototype(MenuItem, GameObject);