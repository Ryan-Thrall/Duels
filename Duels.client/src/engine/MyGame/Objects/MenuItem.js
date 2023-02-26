

function MenuItem(spriteTexture, normalMap, atX, atY, pp, price, type) {
  // Menu Item Background
  this.menuItem = new GameObjectSet();
  this.menuItem.addToSet(new Renderable())
  this.menuItem.getObjectAt(0).setColor([0.25, 0, 0.25, 1])
  this.menuItem.getObjectAt(0).getXform().setSize(173.5, 30)
  this.menuItem.getObjectAt(0).getXform().setPosition(atX, atY)

  // Menu Item Coin
  this.menuItem.addToSet(new LightRenderable(spriteTexture));
  this.menuItem.getObjectAt(1).setColor([1, 1, 1, 0]);
  this.menuItem.getObjectAt(1).getXform().setPosition(atX + 50, atY);
  this.menuItem.getObjectAt(1).getXform().setSize(14, 14);
  this.menuItem.getObjectAt(1).setElementPixelPositions(379, 411, 0, 32);

  // Menu Item Price Text
  this.menuItem.addToSet(new FontRenderable("x " + price));
  this.menuItem.getObjectAt(2).setColor([1, 1, 1, 1]);
  this.menuItem.getObjectAt(2).getXform().setPosition(atX + 63, atY);
  this.menuItem.getObjectAt(2).setTextHeight(10);

  // Menu Item Unit Symbol
  this.menuItem.addToSet(new LightRenderable(spriteTexture));
  this.menuItem.getObjectAt(3).setColor([1, 1, 1, 0]);
  this.menuItem.getObjectAt(3).getXform().setPosition(atX, atY);
  this.menuItem.getObjectAt(3).getXform().setSize(20, 20);
  this.menuItem.getObjectAt(3).setElementPixelPositions(pp[0], pp[1], pp[2], pp[3])


  GameObjectSet.call(this, this.menuItem);
}
gEngine.Core.inheritPrototype(MenuItem, GameObjectSet);