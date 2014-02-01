Session.set("color", "#c2892b");

UI.body.helpers({
  boxes: function () {
    return Boxes.find();
  },
  active: function () {
    return this.valueOf() === Session.get("color");
  },
  colors: ["#c2892b", "#e91d45", "#30d02c",
           "#1d57e9", "#9414c9", "#fee619"]
});

UI.body.events({
  "click .swatch": function () {
    Session.set("color", this.valueOf());
  },
  "mousedown x3d": function () {
    dragged = false;
  },
  "mousemove x3d": function () {
    dragged = true;
  },
  "mouseup shape": function (evt) {
    if (!dragged && evt.button === 1) {
      Boxes.insert({
        color: Session.get("color"),
        x: Math.floor(evt.worldX + evt.normalX / 2) + 0.5,
        y: Math.floor(evt.worldY + evt.normalY / 2) + 0.5,
        z: Math.floor(evt.worldZ + evt.normalZ / 2) + 0.5
      });
    } else if (!dragged &&
      (evt.button === 4 || evt.button === 2)) {
        Boxes.remove(evt.currentTarget.id);
    }
  }
});