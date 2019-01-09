export class Resource {
  constructor(key: string, path: string | string[]) {
    this.key = key;
    this.path = path;
  }
  key: string;
  path: string | string[];
}
