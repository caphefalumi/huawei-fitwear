import { app as fitwearApp } from '../../src/index';
import { withDatabaseBinding, type WorkerBindings } from '../../src/db';

let bindings: WorkerBindings = {};

export function setTestDatabaseBinding(next: WorkerBindings) {
  bindings = next;
}

export const app = {
  handle: (request: Request) => withDatabaseBinding(bindings, () => fitwearApp.handle(request)),
};
