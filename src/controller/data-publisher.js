export class DataPublisher {
  constructor() {
    this.observers = [];
  }
  subscribe(observer) {
    this.observers.push(observer);
  }
  unsubscribe(observer) {
    let index = this.observers.indexOf(observer);
    if(index > -1) {
      this.observers.splice(index, 1);
    }
  }
  notify(observer, data = null) {
    let index = this.observers.indexOf(observer);
    if(index > -1) {
      this.observers[index].notify(data);
    }
  }
  notifyAll(data) {
    this.observers.forEach((o,i) => o.notify(data[i]));
  }
}