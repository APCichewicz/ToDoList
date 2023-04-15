// a class to handle all dom manipulation and event listeners. this will provide the controlls for the user facing gui of the app and will be the subscriber to the PubSub class
// so in effect, when the user interacts with the gui in a way that changes the underlying data model (the ToDoList class), the PubSub class will publish the event to the DOMManipulation class which]
// will then update the gui.

import PubSub from "./PubSub";
import ToDoList from "./ToDoList";
import ToDoItem from "./ToDoItem";

class DOMManipulation {
  constructor(app, pubsub) {
    this.app = app;
    this.listArea = this.app.querySelector("#list-area");
    this.listTitle = this.app.querySelector("#list-title");
    this.pubsub = pubsub;

    this.addEventListeners();
  }

  addEventListeners() {
    this.handleNewTaskClick();
    this.handleAddTodoModalClick();
    this.preventFormElementsClickPropagation();
    this.handleToDoFormSubmit();
    this.handleNewProjectClick();
    this.handleAddProjectModalClick();
    this.handleProjectFormSubmit();
    this.handleDragAndDropEvents();
  }

  // define all event listeners

  handleNewTaskClick() {
    this.app.querySelector("#new-task").addEventListener("click", (e) => {
      if (this.listArea.dataset.project === undefined) return;
      this.app.querySelector("#addTodoModal").classList.toggle("hidden");
    });
  }

  handleAddTodoModalClick() {
    this.app.querySelector("#addTodoModal").addEventListener("click", (e) => {
      if (e.target === this.app.querySelector("#addTodoModal")) {
        this.app.querySelector("#addTodoModal").classList.add("hidden");
      }
    });
  }

  preventFormElementsClickPropagation() {
    const formElements = this.app.querySelectorAll("form *");
    formElements.forEach((element) => {
      element.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    });
  }

  handleToDoFormSubmit() {
    this.app.querySelector("#toDoForm").addEventListener("submit", (e) => {
      e.preventDefault();
      let project = this.listArea.dataset.project;
      this.createTask();
      this.app.querySelector("#addTodoModal").classList.add("hidden");
      this.app.querySelector("#toDoForm").reset();
    });
  }

  handleNewProjectClick() {
    this.app.querySelector("#newProj").addEventListener("click", (e) => {
      this.app.querySelector("#addProjectModal").classList.toggle("hidden");
    });
  }

  handleAddProjectModalClick() {
    this.app
      .querySelector("#addProjectModal")
      .addEventListener("click", (e) => {
        if (e.target === this.app.querySelector("#addProjectModal")) {
          this.app.querySelector("#addProjectModal").classList.add("hidden");
        }
      });
  }

  handleProjectFormSubmit() {
    this.app.querySelector("#projectForm").addEventListener("submit", (e) => {
      e.preventDefault();
      if (this.createProject()) {
        this.app.querySelector("#addProjectModal").classList.add("hidden");
        this.app.querySelector("#projectForm").reset();
      }
    });
  }

  handleDragAndDropEvents() {
    this.app
      .querySelector("#project-area")
      .addEventListener("dragstart", (e) => {
        e.dataTransfer.setData(
          "text/plain",
          JSON.stringify({ name: e.target.dataset.name, type: "project" })
        );
      });
    this.app.querySelector("#list-area").addEventListener("dragstart", (e) => {
      e.dataTransfer.setData(
        "text/plain",
        JSON.stringify({
          project: this.listArea.dataset.project,
          name: e.target.dataset.name,
          type: "task",
        })
      );
    });

    const deleteArea = this.app.querySelector("#delete");
    deleteArea.addEventListener("dragenter", (e) => {
      e.preventDefault();
      if (e.dataTransfer.getData("text/plain")) {
        deleteArea.classList.add("bg-red-200");
      }
    });

    deleteArea.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    deleteArea.addEventListener("dragleave", (e) => {
      e.preventDefault();
      deleteArea.classList.remove("bg-red-200");
    });

    deleteArea.addEventListener("drop", (e) => {
      e.preventDefault();
      deleteArea.classList.remove("bg-red-200");
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));

      if (data.type === "project") {
        this.pubsub.publish("deleteProject", data.name);
        this.resetListArea();
      } else if (data.type === "task") {
        this.pubsub.publish("deleteTask", data);
      }
    });
  }
  addProjectListener(project) {
    project.addEventListener("click", (e) => {
      let name = project.dataset.name;
      this.listArea.dataset.project = name;
      this.listTitle.textContent = "active tasks for: " + name;
      this.pubsub.publish("projectClicked", name);
    });
  }

  // section for taxk and project creation

  // a method to create a todo item when the form is submitted
  createTask() {
    const task = {
      // get the associated project from the selected project
      project: this.app.querySelector("#list-area").dataset.project,
      // get title from form
      title: this.app.querySelector("form").elements.title.value,
      // get description from form
      description: this.app.querySelector("form").elements.description.value,
      // get due date from forml
      dueDate: this.app.querySelector("form").elements.dueDate.value,
      // get priority from form
      priority: this.app.querySelector("form").elements.priority.value,
    };
    //publish this event to the pubsub class as an ItemAdded event
    this.pubsub.publish("NewTask", task);
  }
  createProject() {
    const form = this.app.querySelector("#projectForm");
    // check the form is valid
    if (!form.checkValidity()) {
      // if not, show the error messages
      form.reportValidity();
      return false;
    }
    // publish this event to the pubsub class as a ProjectAdded event
    this.pubsub.publish("NewProject", form.elements.projectName.value);
    return true;
  }

  // dom rendering method section

  resetListArea() {
    this.listArea.dataset.project = "";
    this.listTitle.textContent = "active tasks for: ";
  }
  renderAllTasks(data) {
    this.clearListArea();
    data.map((dataItem) => this.renderTask(dataItem));
  }
  renderAllProjects(data) {
    this.clearListArea();
    data.map((dataItem) => this.renderProject(dataItem));
  }
  clearProjectArea() {
    this.app.querySelector("#project-area").innerHTML = "";
  }
  clearListArea() {
    this.app.querySelector("#list-area").innerHTML = "";
  }
  renderProject(data) {
    console.log("called");
    const project = document.createElement("div");
    // add the project name to the div data attribute for identification
    project.dataset.name = data;
    project.dataset.project = "true";
    project.setAttribute("draggable", true);
    project.classList.add(
      "px-4",
      "mb-22",
      "mx-2",
      "w-100",
      "bg-gray-200",
      "rounded-md",
      "shadow-md",
      "hover:bg-gray-300",
      "hover:shadow-lg",
      "hover:cursor-pointer",
      "hover:scale-105",
      "cursor-pointer",
      "transition-all",
      "duration-300",
      "ease-in-out",
      "text-center"
    );
    const title = document.createElement("h2");
    title.classList.add("text-xl", "font-semibold");
    title.textContent = data;
    project.appendChild(title);
    this.app.querySelector("#project-area").appendChild(project);
    this.addProjectListener(project);
  }
  // a method called when the form is submitted, creating a node object to represent the gui components of a todo item
  renderTask(data) {
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

    root.setAttribute("draggable", true);

    root.classList.add(
      "grid",
      "grid-cols-4",
      "gap-4",
      "p-4",
      "border-2",
      "border-black",
      "rounded-md",
      "tbd",
      "shadow-md"
    );
    // appened the todo item to the appropriate project
    this.app.querySelector(`#list-area`).appendChild(root);
  }
}

//export the class as default
export default DOMManipulation;
