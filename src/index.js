//import the stylesheets
import "./style.css";
//import dom manipulation default
import DOMManipulation from "./DomManipulation";
import ProjectList from "./ToDoList";
import PubSub from "./PubSub";

const pubsub = new PubSub();
const domManipulation = new DOMManipulation(
  document.querySelector("#app"),
  pubsub
);

// if a project list is stored in local storage, use that, otherwise create a new project list
let projList = new ProjectList();
if (localStorage.getItem("projectList") !== null) {
  projList.fromJSON(localStorage.getItem("projectList"));
  // render all the projects in the project list
  projList.getProjects().forEach((project) => {
    domManipulation.renderProject(project.name);
  });
}

pubsub.subscribe("NewProject", (data) => {
  projList.addProject(data);
  domManipulation.renderProject(data);
  localStorage.setItem("projectList", projList.toJSON());
});
// to handle the GetProject event that is published when a project is clicked on, the getProject method will be called
pubsub.subscribe("projectClicked", (data) => {
  let project = projList.getProject(data);
  // if the project has no tasks, do nothing
  if (project.getItems() === undefined) {
    return;
  }
  // otherwise, render all the tasks in the project
  domManipulation.renderAllTasks(project.getItems());
});

pubsub.subscribe("NewTask", (data) => {
  projList.getProject(data.project).addToDoItem(data);
  domManipulation.renderTask(data);
  // save the project list to local storage
  localStorage.setItem("projectList", projList.toJSON());
});
// handle project deletion
pubsub.subscribe("deleteProject", (data) => {
  projList.removeProject(data);
  localStorage.setItem("projectList", projList.toJSON());
  domManipulation.clearProjectArea();
  domManipulation.clearListArea();
  projList.getProjects().forEach((project) => {
    domManipulation.renderProject(project.name);
  });
});
pubsub.subscribe("deleteTask", (data) => {
  projList.getProject(data.project).removeToDoItem(data);
  localStorage.setItem("projectList", projList.toJSON());
  domManipulation.clearListArea();
  domManipulation.renderAllTasks(projList.getProject(data.project).getItems());
});

// if nothing was loaded from local storage, add a default project and render it
if (projList.getProjects().length === 0) {
  projList.addProject("Default");
  domManipulation.renderProject("Default");
}
