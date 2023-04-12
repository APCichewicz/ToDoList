//import the stylesheets
import "./style.css";
//import dom manipulation default
import DOMManipulation from "./DomManipulation";
import ToDoList from "./ToDoList";
import PubSub from "./PubSub";

document.addEventListener("DOMContentLoaded", () => {
  const toDoList = new ToDoList();
  const pubSub = new PubSub();
  const domManipulation = new DOMManipulation(
    document.querySelector("#app"),
    pubSub
  );
  pubSub.subscribe("itemAdded", toDoList.addToDoItem.bind(toDoList));
  pubSub.subscribe("itemAdded", toDoList.updateToDoItem.bind(toDoList));
  pubSub.subscribe("toDoRemoved", toDoList.removeToDoItem.bind(toDoList));
  pubSub.subscribe(
    "itemAdded",
    domManipulation.renderNode.bind(domManipulation)
  );
});
