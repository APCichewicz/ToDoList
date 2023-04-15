// a class to manage a list of todoitems i.e store, return, and update them
// this class will be the publisher of the pubsub class
// it does this to allow the DOMManipulation class to subscribe to the events that it publishes
// and thereby update the gui when the underlying data model changes

import ToDoItem from "./ToDoItem";

// a class to hold and manage a list of projects

class ProjectList {
  constructor() {
    //create an array to store projects
    this.projects = [];
  }
  //add a project to the list
  addProject(data) {
    //create a new project
    const project = new Project(data);
    //add the project to the list
    this.projects.push(project);
  }
  //remove a project from the list
  removeProject(data) {
    //find the project in the list
    const project = this.projects.find((project) => project.name === data);
    //remove the project from the list
    this.projects.splice(this.projects.indexOf(project), 1);
  }
  //return the list of projects
  getProjects() {
    return this.projects;
  }
  //return a specific project
  getProject(data) {
    return this.projects.find((project) => project.name === data);
  }
  toJSON() {
    const projectsJson = this.projects.map((project) => {
      return {
        name: project.name,
        items: project.getItems().map((item) => {
          return {
            title: item.title,
            description: item.description,
            dueDate: item.dueDate,
            priority: item.priority,
          };
        }),
      };
    });

    return JSON.stringify(projectsJson, null, 2);
  }
  // a method to load a projectlist from json string
  fromJSON(json) {
    const projects = JSON.parse(json);
    projects.forEach((project) => {
      this.addProject(project.name);
      project.items.forEach((item) => {
        this.getProject(project.name).addToDoItem(item);
      });
    });
  }
}

// a project class to manage individual todolists, essentially a wrapper class for segragation of of unrelated tasklists

class Project {
  constructor(name) {
    this.name = name;
    this.list = new ToDoList();
  }
  // add a todo item to the list
  addToDoItem(data) {
    this.list.addToDoItem(data);
  }
  // update a todo item in the list
  updateToDoItem(data) {
    this.list.updateToDoItem(data);
  }
  // remove a todo item from the list
  removeToDoItem(data) {
    this.list.removeToDoItem(data);
  }
  // return the list of items
  getItems() {
    return this.list.getItems();
  }
}

class ToDoList {
  constructor() {
    //create an array to store todo items
    this.items = [];
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

export default ProjectList;
