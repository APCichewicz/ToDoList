// a class to handle all dom manipulation and event listeners. this will provide the controlls for the user facing gui of the app and will be the subscriber to the PubSub class
// so in effect, when the user interacts with the gui in a way that changes the underlying data model (the ToDoList class), the PubSub class will publish the event to the DOMManipulation class which]
// will then update the gui.

import PubSub from "./PubSub";
import ToDoList from "./ToDoList";
import ToDoItem from "./ToDoItem";

class DOMManipulation {
  constructor(app, pubsub) {
    this.app = app;
    this.pubsub = pubsub;
    // event listeners to handle showing and hiding the form
    this.app.querySelector("#addTodo").addEventListener("click", (e) => {
      this.app.querySelector("#form-container").classList.toggle("hidden");
    });
    // clicking outside the form hides it again, but not the form itself
    this.app.querySelector("#form-container").addEventListener("click", (e) => {
      if (e.target === this.app.querySelector("#form-container")) {
        this.app.querySelector("#form-container").classList.add("hidden");
      }
    });
    // prevent propogation so it doesnt hide the form when the form itself is clicked
    this.app.querySelector("form").addEventListener("click", (e) => {
      e.stopPropagation();
    });
    // event listener to handle form submission
    this.app.querySelector("form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.createNode();
    });
  }
  // a method called when the form is submitted, creating a node object to represent the gui components of a todo item
  renderNode(data) {
    const root = document.createElement("div");
    root.id = "ToDoTile";
    const title = document.createElement("h2");
    title.classList.add("text-2xl", "font-bold");
    const description = document.createElement("p");
    description.classList.add("text-lg");
    const dueDate = document.createElement("p");
    dueDate.classList.add("text-lg");
    const priority = document.createElement("p");
    priority.classList.add("text-lg");

    title.textContent = data.title;
    description.textContent = data.description;
    dueDate.textContent = data.dueDate;
    priority.textContent = data.priority;

    root.appendChild(title);
    root.appendChild(description);
    root.appendChild(dueDate);
    root.appendChild(priority);

    root.classList.add(
      "grid",
      "grid-cols-4",
      "gap-4",
      "p-4",
      "border-2",
      "border-black",
      "rounded-md"
    );
    console.log("renderNode called ${root}");
    this.app.querySelector("#todo-list").appendChild(root);
  }
  // a method to create a todo item when the form is submitted
  createNode(data) {
    const node = {
      // get title from form
      title: this.app.querySelector("form").elements.title.value,
      // get description from form
      description: this.app.querySelector("form").elements.description.value,
      // get due date from form
      dueDate: this.app.querySelector("form").elements.dueDate.value,
      // get priority from form
      priority: this.app.querySelector("form").elements.priority.value,
    };
    //publish this event to the pubsub class as an ItemAdded event
    this.pubsub.publish("itemAdded", node);
  }
  // render all nodes in a list if provided
  renderAll(data) {
    data.map((dataItem) => this.renderNode(dataItem));
  }
}

//export the class as default
export default DOMManipulation;
