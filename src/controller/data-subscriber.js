export class DataSubscriber {
  constructor(cb) {
    this.callback = cb;
  }
  notify(data) {
    // Invoke the callback with new data
    this.callback(data);
  }
}