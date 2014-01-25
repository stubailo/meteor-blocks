Boxes = new Meteor.Collection("boxes");

var colors = [
  "red",
  "green",
  "blue"
];

var randomLocation = function () {
  return Random.fraction() * 6 - 3;
};

if (Meteor.isClient) {
  Template.hello.helpers({
    boxes: function () {
      return Boxes.find();
    }
  });

  Template.hello.events({
    "click .add-box": function () {
      Boxes.insert({
        color: Random.choice(colors),
        x: randomLocation(),
        y: randomLocation(),
        z: randomLocation()
      });
    },
    "click .clear-boxes": function () {
      Meteor.call("clearBoxes");
    }
  });
}

if (Meteor.isServer) {
  Meteor.methods({
    clearBoxes: function () {
      Boxes.remove({});
    }
  });
}