// an intermediate class to loosely couple the todolist and the DOM manipulation. will function as a pulisher/subscriber model
// this class will be used to publish the events to the DOM manipulation class
class PubSub {
  constructor() {
    this.events = {};
  }

  // register callbacks to a specific event
  subscribe(event, callback) {
    let self = this;
    if (!self.events.hasOwnProperty(event)) {
      self.events[event] = [];
    }
    return self.events[event].push(callback);
  }
  // on event, call all the callbacks registered to that event
  publish(event, data = {}) {
    let self = this;
    if (!self.events.hasOwnProperty(event)) {
      return [];
    }
    return self.events[event].map((callback) => callback(data));
  }
}
module.exports = PubSub;
