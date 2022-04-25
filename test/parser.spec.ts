import { Parser } from '@tanbo/json-parser'

describe('JSON Parser', () => {
  const parser = new Parser()

  test('支持单行注释', () => {
    expect(parser.parse(`
    // test
    {}//test
    // test
    `)).toEqual({})
  })

  test('支持块注释', () => {
    expect(parser.parse(`
    {/*
    comment
    */}
    `)).toEqual({})
  })

  test('支持无引号 key', () => {
    expect(parser.parse(`
    {key: 'value'}
    `)).toEqual({ key: 'value' })
  })

  test('支持单引号 key', () => {
    expect(parser.parse(`
    {'key': 'value'}
    `)).toEqual({ key: 'value' })
  })

  test('支持双引号 key', () => {
    expect(parser.parse(`
    {"key": 'value'}
    `)).toEqual({ key: 'value' })
  })

  test('支持空 key', () => {
    expect(parser.parse(`
    {"": 'value'}
    `)).toEqual({ '': 'value' })
  })

  test('支持 boolean', () => {
    expect(parser.parse(`
    {key: true}
    `)).toEqual({ key: true })
    expect(parser.parse(`
    {key: false}
    `)).toEqual({ key: false })
  })

  test('支持 null', () => {
    expect(parser.parse(`
    {key: null}
    `)).toEqual({ key: null })
  })

  test('忽略常量后空白', () => {
    expect(parser.parse(`
    {key: null }
    `)).toEqual({ key: null })
  })

  test('支持数字', () => {
    expect(parser.parse(`
    {key: 1}
    `)).toEqual({ key: 1 })

    expect(parser.parse(`
    {key: -1}
    `)).toEqual({ key: -1 })

    expect(parser.parse(`
    {key: 0.1}
    `)).toEqual({ key: 0.1 })

    expect(parser.parse(`
    {key: -0.1}
    `)).toEqual({ key: -0.1 })

    expect(parser.parse(`
    {key: 1e3}
    `)).toEqual({ key: 1000 })

    expect(parser.parse(`
    {key: -1e3}
    `)).toEqual({ key: -1000 })

    expect(parser.parse(`
    {key: 5.6649e-10}
    `)).toEqual({ key: 0.00000000056649 })

    expect(parser.parse(`
    {key: 5.6649e+10}
    `)).toEqual({ key: 56649000000 })
  })

  test('支持 unicode', () => {
    expect(parser.parse(`
    {key: '\\u6d4b\\u8bd5\\u6587\\u5b57'}
    `)).toEqual({ key: '测试文字' })
  })

  test('支持特殊转义', () => {
    expect(parser.parse(`
    {key: '\\x'}
    `)).toEqual({ key: 'x' })
  })

  test('支持冗余逗号', () => {
    expect(parser.parse(`
    {key: 'value',arr: [2,4,],}
    `)).toEqual({ key: 'value', arr: [2, 4] })
  })

  test('支持最外层为数组', () => {
    expect(parser.parse(`
    [{key: 'value'}]
    `)).toEqual([{ key: 'value' }])
  })

  test('支持空数组', () => {
    expect(parser.parse(`
    []
    `)).toEqual([])
  })

  test('支持空 JSON', () => {
    expect(parser.parse(`
    {}
    `)).toEqual({})
  })

  test('支持转义字符', () => {
    expect(parser.parse(`
    {key: 'test \`code\`'}
    `)).toEqual({ key: 'test `code`' })
  })

  test('支持输出转义字符', () => {
    expect(parser.parse(`
    {key: 'line \\n next line'}
    `)).toEqual({ key: 'line \n next line' })
  })

  test('支持常量紧邻的注释', () => {
    expect(parser.parse(`{
      key: true//
      ,
      key1:true/*test*/,
      key2:true ,
      key3:null//
      ,
      key4:null/*test*/,
      key5:null ,
      key6:false//
      ,
      key7:false/*test*/,
      key8:false ,
    }`)).toEqual({
      key: true,
      key1: true,
      key2: true,
      key3: null,
      key4: null,
      key5: null,
      key6: false,
      key7: false,
      key8: false
    })
  })

  test('尾常量正确跳出结构', () => {
    expect(parser.parse(`{
       key1: [true],
       key2: [false],
       key3: [null],
       key4: {child:true},
       key5: {child:true,},
       key6: {child:false},
       key7: {child:false,},
       key8: {child:null},
       key9: {child:null,},
       key10: true ,
       key11: false ,
       key12: null ,
    }`)).toEqual({
      key1: [true],
      key2: [false],
      key3: [null],
      key4: { child: true },
      key5: { child: true },
      key6: { child: false },
      key7: { child: false },
      key8: { child: null },
      key9: { child: null },
      key10: true,
      key11: false,
      key12: null,
    })
  })

  test('支持嵌套结构', () => {
    expect(parser.parse('{key1: [null,false,true,1,\'xxx\',{key: \'value\'}],key2:{childKey1: 1}}')).toEqual({
      key1: [null, false, true, 1, 'xxx', { key: 'value' }],
      key2: { childKey1: 1 }
    })
  })
})

describe('JSON Parser error', () => {
  const parser = new Parser()
  let fn
  beforeEach(() => {
    fn = jest.fn()
  })

  test('不是正确的开始', () => {
    try {
      parser.parse('test')
    } catch (e) {
      fn()
    }
    expect(fn).toHaveBeenCalled()
  })

  test('不是正确的结束-数组', () => {
    try {
      parser.parse('[')
    } catch (e) {
      fn()
    }
    expect(fn).toHaveBeenCalled()
  })

  test('不是正确的结束-JSON', () => {
    try {
      parser.parse('{')
    } catch (e) {
      fn()
    }
    expect(fn).toHaveBeenCalled()
  })

  test('缺少分号', () => {
    try {
      parser.parse('{key 22}')
    } catch (e) {
      fn()
    }
    expect(fn).toHaveBeenCalled()
  })

  test('JSON缺少逗号', () => {
    try {
      parser.parse('{key: 22 key2: 33}')
    } catch (e) {
      fn()
    }
    expect(fn).toHaveBeenCalled()
  })

  test('数组缺少逗号', () => {
    try {
      parser.parse('[2, 3 4]')
    } catch (e) {
      fn()
    }
    expect(fn).toHaveBeenCalled()
  })

  test('不是正确的数字', () => {
    try {
      parser.parse('[2.xx]')
    } catch (e) {
      fn()
    }
    expect(fn).toHaveBeenCalled()
  })

  test('多余的小数点', () => {
    try {
      parser.parse('[2.3.5]')
    } catch (e) {
      fn()
    }
    expect(fn).toHaveBeenCalled()
  })

  test('异常的科学记数法', () => {
    try {
      parser.parse('[2.4e-u]')
    } catch (e) {
      fn()
    }
    expect(fn).toHaveBeenCalled()
  })

  test('异常的非注释斜线', () => {
    try {
      parser.parse('{key: 4/}')
    } catch (e) {
      fn()
    }
    expect(fn).toHaveBeenCalled()
  })

  test('错误的 unicode', () => {
    try {
      parser.parse('{key: "\\uxxxx"}')
    } catch (e) {
      fn()
    }
    expect(fn).toHaveBeenCalled()
  })

  test('意外的值', () => {
    try {
      parser.parse('{key: xxx}')
    } catch (e) {
      fn()
    }
    expect(fn).toHaveBeenCalled()
  })

  test('不正确的 true', () => {
    try {
      parser.parse('{key: truexxx}')
    } catch (e) {
      fn()
    }
    expect(fn).toHaveBeenCalled()
  })
  test('不正确的 null', () => {
    try {
      parser.parse('{key: nullxxx}')
    } catch (e) {
      fn()
    }
    expect(fn).toHaveBeenCalled()
  })
  test('不正确的 false', () => {
    try {
      parser.parse('{key: falsexxx}')
    } catch (e) {
      fn()
    }
    expect(fn).toHaveBeenCalled()
  })
})
