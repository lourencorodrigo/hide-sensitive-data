import { mask } from './index'

describe('obfuscateData', () => {
  it('should obfuscate email using a different pattern', () => {
    const data = { email: 'example@gmail.com' }
    const newDate = mask(data, [
      {
        key: 'email',
        replacement(value) {
          const values = value.split('@')
          return `*******@${values[1]}`
        },
      },
    ])
    expect(newDate).toEqual({ email: '*******@gmail.com' })
  })

  it('should obfuscate email using a different pattern', () => {
    const data = { email: 'example@gmail.com' }
    const newDate = mask(data, [
      {
        key: 'email',
        replacement: () => undefined,
      },
    ])
    expect(newDate).toEqual({ email: undefined })
  })

  it('should obfuscate email using a replacement as a function', () => {
    const data = { email: 'example@gmail.com', cpf: '123232' }
    const newDate = mask(data, [
      {
        key: 'email',
        replacement: () => '**',
      },
    ])
    expect(newDate).toEqual({ email: '**', cpf: '123232' })
  })

  it('should obfuscate email using a replacement as a string', () => {
    const data = { email: 'example@gmail.com', cpf: '123232' }
    const newDate = mask(data, [
      {
        key: 'email',
        replacement: '****',
      },
    ])
    expect(newDate).toEqual({ email: '****', cpf: '123232' })
  })

  it('should not obfuscate anything', () => {
    const data = { email: 'example@gmail.com', cpf: '123232' }
    const newDate = mask(data, [])
    expect(newDate).toEqual(data)
  })

  it('should validate that mask is not changing the reference of data', () => {
    const data = { person: { name: 'Ana' } }
    const newData = mask(data, [{key: 'person.name', replacement: '******'}])
    expect(newData).not.toEqual(data)
    expect(data).toEqual(data)
  })

  it('shoud not obfuscate as we are passing ignore with a value of true', () => {
    const data = { email: 'example@gmail.com' }
    const newDate = mask(data, [
      {
        key: 'email',
        ignore: true,
        replacement: () => undefined,
      },
    ])
    expect(newDate).toEqual(data)
  })

  it('shoud obfuscate as we are passing ignore with a value of false', () => {
    const data = { email: 'example@gmail.com' }
    const newDate = mask(data, [
      {
        key: 'email',
        ignore: false,
        replacement: () => undefined,
      },
    ])
    expect(newDate).toEqual({ email: undefined })
  })
})
