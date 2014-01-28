x3dom.Viewarea.prototype.callEvtHandler = function (node, eventType, event) {
  if (!node || !node._xmlNode) {
    return null;
  }
      
  event.target = node._xmlNode;
  var attrib = node._xmlNode[eventType];

  try {
    // XXX keep events as attributes?
    if (typeof(attrib) === "function") {
      attrib.call(node._xmlNode, event);
    } else {
      var funcStr = node._xmlNode.getAttribute(eventType);
      // yikes, eval
      var func = new Function('event', funcStr);
      func.call(node._xmlNode, event);
    }

    var listeners = node._listeners[event.type];
    if (listeners) {
      _.each(listeners, function (listener) {
        listener.call(node._xmlNode, event);
      });
    }
  } catch (e) {
    x3dom.debug.logException(e);
  }

  var jqEvent = jQuery.Event(eventType, event);
  $(node._xmlNode).trigger(jqEvent);
  return true;
};

// each color has a list so that we have a little variation
var colors = {
  brown: ["#c2892b", "#af7c27", "#b57813"],
  red: ["#e91d45", "#e91d22", "#e60f3d"],
  green: ["#30d02c", "#26bf22", "#30c12d"],
  blue: ["#1d57e9", "#194dd1", "#1d68d9"],
  purple: ["#9414c9"],
  yellow: ["#fee619"]
};

// set initial color
Session.set("color", "brown");

// set initial mode to view
Session.set("mode", "view");

// this uses the Shark branch of Meteor, hence the UI namespace
UI.body.helpers({
  // all boxes in collection
  // XXX should at some point be scoped to user
  boxes: function () {
    return Boxes.find();
  },
  // list of colors for color picker
  colors: function () {
    return _.map(_.keys(colors), function (name) {
      return {
        name: name,
        code: colors[name][0]
      };
    });
  },
  // active color helper for color picker
  activeColor: function () {
    return this.name === Session.get("color");
  },
  // see if we are in build mode
  buildMode: function () {
    return Session.equals("mode", "build");
  }
});

// events on the dialog with lots of buttons
UI.body.events({
  "click .clear-boxes": function () {
    Meteor.call("clearBoxes");
  },
  "click .swatch": function () {
    Session.set("color", this.name);
  },
  "click button.view-mode": function (event, template) {
    Session.set("mode", "view");
    template.find("x3d").runtime.turnTable();
  },
  "click button.build-mode": function (event, template) {
    Session.set("mode", "build");
    template.find("x3d").runtime.noNav();
  },
  "mousedown shape": function (event) {
    if (Session.get("mode") === "build") {
      if (event.button === 1) {
        // left click to add box

        // calculate new box position based on location of click event
        // in 3d space and the normal of the surface that was clicked
        var x = Math.floor(event.worldX + event.normalX / 2) + 0.5,
          y = Math.floor(event.worldY + event.normalY / 2) + 0.5,
          z = Math.floor(event.worldZ + event.normalZ / 2) + 0.5;

        Boxes.insert({
          color: Random.choice(colors[Session.get("color")]),
          x: x,
          y: y,
          z: z
        });
      } else if (event.button === 4 || event.button === 2) {
        // right click to remove box
        Boxes.remove(event.currentTarget.id);
      }
    }
  }
});
