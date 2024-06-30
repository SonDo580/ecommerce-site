import lodash from "lodash";

export class TransformUtil {
  static extractFields(obj: object = {}, fields: string[] = []) {
    return lodash.pick(obj, fields);
  }
}
