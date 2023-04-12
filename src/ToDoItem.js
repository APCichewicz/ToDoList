// a data class for to do items which will hold the title, description, due date, and priority of the to do item
class ToDoItem {
  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
  }
}
export default ToDoItem;
