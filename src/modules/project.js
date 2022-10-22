export class Project {
  constructor(title, description) {
    this.title = title;
    this.description = description || "";
    this.todos = [];
  }
  get getTitle() { return this.title; }
  get getDescription() { return this.description; }
  
}