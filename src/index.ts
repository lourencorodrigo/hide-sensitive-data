import cloneDeep from "lodash.clonedeep";

type DeepKeyOf<T> = T extends object
  ? { [K in keyof T]: K | `${K & string}.${DeepKeyOf<T[K]> & string}` }[keyof T]
  : never;

type SensitiveValues<K> = Array<
  | {
      key: K;
      replacement: ((value: any) => any) | string;
      ignore?: boolean;
    }
  | (K & string)
>;

function hideCharacters(value: any): string {
  const stringValue = String(value);

  if (typeof value === "string" || typeof value === "number") {
    return "*".repeat(stringValue.length);
  } else {
    return "*";
  }
}

export function mask<T, K extends DeepKeyOf<T>>(
  obj: T,
  sensitiveValues: SensitiveValues<K>
) {
  const newObj = cloneDeep(obj);

  sensitiveValues.forEach((sensitiveValue) => {
    const properties: string[] = (
      typeof sensitiveValue === "string" ? sensitiveValue : sensitiveValue.key
    )
      .toString()
      .split(".");
    let currentObj: any = newObj;

    if (typeof sensitiveValue !== "string" && sensitiveValue.ignore) {
      return;
    }

    for (let i = 0; i < properties.length; i++) {
      const property = properties[i];
      if (Object.prototype.hasOwnProperty.call(currentObj, property)) {
        if (i === properties.length - 1) {
          let newValue;
          if (typeof sensitiveValue === "string") {
            newValue = hideCharacters(currentObj[property]);
          } else {
            newValue =
              typeof sensitiveValue.replacement === "string"
                ? sensitiveValue.replacement
                : sensitiveValue.replacement(currentObj[property]);
          }

          currentObj[property] = newValue;
        } else {
          currentObj = currentObj[property];
        }
      }
    }
  });

  return newObj;
}
