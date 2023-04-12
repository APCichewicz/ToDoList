// a class to manage a list of todoitems i.e store, return, and update them
// this class will be the publisher of the pubsub class
// it does this to allow the DOMManipulation class to subscribe to the events that it publishes
// and thereby update the gui when the underlying data model changes

import ToDoItem from "./ToDoItem";
class ToDoList {
  constructor(pubsub) {
    //create an array to store todo items
    this.items = [];
    //create a pubsub object to publish events
    this.pubsub = pubsub;
  }
  //add a todo item to the list
  addToDoItem(data) {
    //create a new todo item
    const item = new ToDoItem(
      data.title,
      data.description,
      data.dueDate,
      data.priority
    );
    //add the item to the list
    this.items.push(item);
  }
  updateToDoItem(data) {
    //find the item in the list
    const item = this.items.find((item) => item.title === data.title);
    //update the item
    item.description = data.description;
    item.dueDate = data.dueDate;
    item.priority = data.priority;
  }
  removeToDoItem(data) {
    //find the item in the list
    const item = this.items.find((item) => item.title === data.title);
    //remove the item from the list
    this.items.splice(this.items.indexOf(item), 1);
  }

  //return the list of items
  getItems() {
    //return the array
    return this.items;
  }
}

export default ToDoList;
