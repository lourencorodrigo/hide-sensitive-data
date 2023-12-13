import cloneDeep from 'lodash.clonedeep'

type DeepKeyOf<T> = T extends object
  ? { [K in keyof T]: K | `${K & string}.${DeepKeyOf<T[K]> & string}` }[keyof T]
  : never;

type SensitiveValues<K> = Array<{
  key: K
  replacement: ((value: any) => any) | string
  ignore?: boolean
}>

export function mask<T, K extends DeepKeyOf<T>>(
  obj: T,
  sensitiveValues: SensitiveValues<K>,
) {
  const newObj = cloneDeep(obj)
  
  sensitiveValues.forEach((sensitiveValue) => {
    const properties: string[] = sensitiveValue.key.toString().split('.')
    let currentObj: any = newObj

    if (sensitiveValue.ignore) {
      return
    }

    for (let i = 0; i < properties.length; i++) {
      const property = properties[i]
      if (Object.prototype.hasOwnProperty.call(currentObj, property)) {
        if (i === properties.length - 1) {
          currentObj[property] =
              typeof sensitiveValue.replacement === 'string'
                ? sensitiveValue.replacement
                : sensitiveValue.replacement(currentObj[property])
        } else {
          currentObj = currentObj[property]
        }
      }
    }
  })

  return newObj
}
