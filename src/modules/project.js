export class Project {
  constructor(title, description) {
    this.title = title;
    this.description = description || "";
  }
  get getTitle() { return this.title; }
  get getDescription() { return this.description; }
}