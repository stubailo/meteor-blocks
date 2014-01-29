// patch x3dom to throw a real bubbling event with 
// a real currentTarget
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

  if (eventType === "viewpointChanged") {
    console.log("whatup");
  }
  var jqEvent = jQuery.Event(eventType, event);
  $(node._xmlNode).trigger(jqEvent);
  return true;
};
