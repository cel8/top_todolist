import { Project } from 'Modules/project';
import { TaskFactory, taskType } from 'Modules/task.js';

export const storageTable = {
  projectTable: 'localTodoList',
  taskTable: 'localTodoTaskList'
}

export class StorageController {
  constructor(table) {
    if(!storageTable[table]) throw 'Invalid table name';
    this.lStorageTableName = storageTable[table];
  }
  deserialize() {
    let data;
    const jsonParseData = JSON.parse(localStorage.getItem(this.lStorageTableName), this.#reviver);
    if(jsonParseData) {
      if(this.lStorageTableName === storageTable.projectTable) {
        data = jsonParseData.map((project) => new Project(project.title, project.description));
      } else {
        data = new Map();
        jsonParseData.forEach((value, key) => {
          // Initialize the Map value
          data.set(key, []);
          // For each value in Map
          value.forEach(v => {
            // Create a new task for map
            const task = TaskFactory.createTask(v.type, v.title, v.description, v.dueDate, v.priority);
            task.setDone = v.done;
            if(taskType.note === taskType[v.type]) {
              task.setNote = v.note;
            } else {
              v.checkList.forEach(a => task.add(a.id, a.action, a.done));
            }
            data.get(key).push(task); 
          });  
        });
      }
    } else {
      data = this.lStorageTableName === storageTable.projectTable ? [] : new Map();
    }
    return data;
  }
  serialize(data) {
    localStorage.setItem(this.lStorageTableName, JSON.stringify(data, this.#replacer));
  }
  #replacer(key, value) {
    if (typeof value === 'object' && value !== null) {
      if (value instanceof Map) {
        return {
          _meta: { type: 'map' },
          value: Array.from(value.entries()),
        };
      } else if (value instanceof Set) { // bonus feature!
        return {
          _meta: { type: 'set' },
          value: Array.from(value.values()),
        };
      } else if ('_meta' in value) {
        // Escape '_meta' properties
        return {
          ...value,
          _meta: {
            type: 'escaped-meta',
            value: value['_meta'],
          },
        };
      }
    }
    return value;
  }
  #reviver(key, value) {
    if (typeof value === 'object' && value !== null) {
      if ('_meta' in value) {
        if (value._meta.type === 'map') {
          return new Map(value.value);
        } else if (value._meta.type === 'set') {
          return new Set(value.value);
        } else if (value._meta.type === 'escaped-meta') {
          // Un-escape the '_meta' property
          return {
            ...value,
            _meta: value._meta.value,
          };
        } else {
          console.warn('Unexpected meta', value._meta);
        }
      }
    }
    return value;
  }
}
