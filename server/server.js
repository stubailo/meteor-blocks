Boxes = new Meteor.Collection("boxes");

Meteor.methods({
  clearBoxes: function () {
    Boxes.remove({});
  }
});