import { Parser } from '@tanbo/json-parser';

const parser = new Parser();
window['parser'] = parser;

const json = parser.parse(`
{
  "key": "/*test*/" /* 
  
  // test
  
  */,
  "key2": "testes// test"
}
`);

console.log(json)


const str = `
{
  "key": "/*test*/" /* 
  
  // test
  
  */,
  "key2": "testes// test"
}
`


str.replace(/fdsaf/, '')
