import lodash from "lodash";

export class TransformUtil {
  static extractFields<T, K extends keyof T>(obj: T, fields: K[]): Pick<T, K> {
    return lodash.pick(obj, fields) as Pick<T, K>;
  }
}
