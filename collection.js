Boxes = new Meteor.Collection("boxes");
Scenes = new Meteor.Collection("scenes");

if (Meteor.isServer) {
  Boxes._ensureIndex({
    sceneId: 1,
    x: 1,
    y: 1,
    z: 1
  }, {unique: true});
}