export class Project {
  constructor(name, description) {
    this.name = name;
    this.description = description || "";
  }
  get getName() { return this.name; }
  get getDescription() { return this.description; }
}