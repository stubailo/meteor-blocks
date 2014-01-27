// it's not possible to remove all without making a method
Meteor.methods({
  clearBoxes: function () {
    Boxes.remove({});
  }
});
