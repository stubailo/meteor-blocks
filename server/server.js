// it's not possible to remove all without making a method
Meteor.methods({
  addBoxToScene: function (sceneId, box) {
    check(sceneId, String);
    check(box, {
      color: String,
      x: Number,
      y: Number,
      z: Number
    });

    var scene = Scenes.findOne(sceneId);
    if (!scene) {
      throw new Meteor.Error(403, "Scene doesn't exist.");
    }

    if (scene.frozen) {
      throw new Meteor.Error(403, "Can't add blocks to frozen scene.");
    }
 
    box.sceneId = sceneId;
    Boxes.insert(box);
  },
  removeBoxFromScene: function (sceneId, boxId) {
    check(sceneId, String);
    check(boxId, String);

    var box = Boxes.findOne(boxId);
    if (box.sceneId !== sceneId) {
      throw new Meteor.Error(403, "Box doesn't belong to this scene.");
    }

    var scene = Scenes.findOne(sceneId);
    if (!scene) {
      throw new Meteor.Error(403, "Scene doesn't exist.");
    }

    if (scene.frozen) {
      throw new Meteor.Error(403, "Can't add blocks to frozen scene.");
    }

    Boxes.remove(boxId);
  },
  clearBoxes: function (sceneId) {
    check(sceneId, String);
    Boxes.remove({sceneId: sceneId});
  },
  newScene: function () {
    var id = Scenes.insert({
      createdAt: new Date()
    });

    return id;
  },
  cloneScene: function (sceneId) {
    check(sceneId, String);

    // make new scene
    var id = Scenes.insert({
      createdAt: new Date(),
      clonedFrom: sceneId
    });

    // get all old boxes
    var boxes = Boxes.find({sceneId: sceneId}).fetch();
    boxes.forEach(function (box) {
      delete box._id;
      box.sceneId = id;

      Boxes.insert(box);
    });

    return id;
  },
  freezeScene: function (sceneId, screenshot) {
    Scenes.update(
      { _id: sceneId },
      { $set:
        {
          frozen: true
        }
      }
    );

    Meteor.call("uploadScreenshot", sceneId, screenshot);
  },
  uploadScreenshot: function (sceneId, screenshot) {
    check(sceneId, String);
    check(screenshot, String);

    this.unblock();

    var result;

    // app should still run without Imgur enabled
    if (Config.imgurClientId) {
      try {
        result = HTTP.post("https://api.imgur.com/3/image",
          {
            params: {
              type: "base64",
              image: screenshot.split(",")[1],
              name: "thumbnail.png",
              title: "Meteor Blocks Thumbnail",
              description: "Thumbnail for " + Utils.linkToScene(sceneId)
            },
            headers: {
              Authorization: "Client-ID " + Config.imgurClientId
            }
          }
        );
      } catch (error) {
        // do nothing, we still have the Data URI
        console.log(error.stack);
      }
    }

    // replace Data URI with Imgur Link
    if (result && result.data && result.data.data && result.data.data.link) {
      screenshot = result.data.data.link;
    }

    Scenes.update(
      { _id: sceneId },
      { $set:
        {
          screenshot: screenshot
        }
      }
    );
  }
});

Meteor.publish("scenes", function (sceneId) {
  check(sceneId, String);

  return Scenes.find({_id: sceneId});
});

Meteor.publish("frozenScenes", function () {
  return Scenes.find({frozen: true});
});

Meteor.publish("boxes", function (sceneId) {
  check(sceneId, String);

  if (sceneId) {
    return Boxes.find({sceneId: sceneId});
  } else {
    return [];
  }
});
