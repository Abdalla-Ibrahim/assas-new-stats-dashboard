import { EventEmitter } from "node:events";

type DataChangePayload = {
  version: number;
  entity: string;
  id?: string;
  changedAt: string;
};

const emitter = new EventEmitter();
let version = 1;

export function publishDataChange(entity: string, id?: string) {
  version += 1;
  const payload: DataChangePayload = {
    version,
    entity,
    id,
    changedAt: new Date().toISOString(),
  };
  emitter.emit("change", payload);
  return payload;
}

export function getDataVersion() {
  return version;
}

export function onDataChange(listener: (payload: DataChangePayload) => void) {
  emitter.on("change", listener);
  return () => emitter.off("change", listener);
}

