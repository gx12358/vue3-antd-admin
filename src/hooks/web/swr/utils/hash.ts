import { isUndefined, OBJECT } from './shared'

const table = new WeakMap()

const getTypeName = (value: any) => OBJECT.prototype.toString.call(value)

const isObjectTypeName = (typeName: string, type: string) =>
  typeName === `[object ${type}]`

// counter of the key
let counter = 0

// hashes an array of objects and returns a string
export default function hash(arg: any): string {
  const type = typeof arg
  const typeName = getTypeName(arg)
  const isDate = isObjectTypeName(typeName, 'Date')
  const isRegex = isObjectTypeName(typeName, 'RegExp')
  const isPlainObject = isObjectTypeName(typeName, 'Object')
  let result: any
  let index: any

  if (OBJECT(arg) === arg && !isDate && !isRegex) {
    // Object/function, not null/date/regexp. Use WeakMap to store the id first.
    // If it's already hashed, directly return the result.
    result = table.get(arg)
    if (result) return result

    // Store the hash first for circular reference detection before entering the
    // recursive `stableHash` calls.
    // For other objects like set and map, we use this id directly as the hash.
    result = ++counter + '~'
    table.set(arg, result)

    if (Array.isArray(arg)) {
      // Array.
      result = '@'
      for (index = 0; index < arg.length; index++) {
        result += hash(arg[index]) + ','
      }
      table.set(arg, result)
    }
    if (isPlainObject) {
      // Object, sort keys.
      result = '#'
      const keys = OBJECT.keys(arg).sort()
      while (!isUndefined((index = keys.pop() as string))) {
        if (!isUndefined(arg[index])) {
          result += index + ':' + hash(arg[index]) + ','
        }
      }
      table.set(arg, result)
    }
  } else {
    result = isDate
      ? arg.toJSON()
      // eslint-disable-next-line
      : type == 'symbol'
        ? arg.toString()
        // eslint-disable-next-line
        : type == 'string'
          ? JSON.stringify(arg)
          : '' + arg
  }

  return result
}
