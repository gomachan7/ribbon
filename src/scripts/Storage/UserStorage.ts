import {
  BoolStorage,
  StringStorage,
  NumberStorage,
  ObjectStorage,
  ClearAllLocalStorageInApp
} from 'Core/LocalStorageAPI';

export class UserStorage {
  static ClearAll = ClearAllLocalStorageInApp;

  // Exsamples
  // Write: UserStorege.myObject.value = {test: 10};
  // Read: var value = UserStorege.myObject.value; # => {test: 10}
  static myBool = new BoolStorage('myBool');
  static myString = new StringStorage('myStoring');
  static myNumber = new NumberStorage('myBool');
  static myObject = new ObjectStorage<{ test: number }>('myObject');
}
