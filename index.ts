import { Lexer, Parser } from '@tanbo/json-parser';

const lexer = new Lexer();
const parser = new Parser(lexer);
window['parser'] = parser;

const json = parser.parse(`
// test
{
test: false,
  "resp_common": { //fdasfdasfdas
    "ret": 0,
    "msg": "ok",
    "request_id": "5f9fc026-23886a5e"
  },
  "data": [
    {/*fdsfdafdas*/
      "id": /**q e sgda*/75638215,
      "url": "https://oss-doufan-static.oss-cn-hangzhou.aliyuncs.com/swift_static/spread_2.html?d_id=6661&d_sid=1589906&d_mp=hksj",
      "title": "冰冰走出情伤？被曝已跟71岁富豪完婚并怀孕！",
      "summary": "",
      "imgs": [
        "//dh1.cmcmcdn.com/e/d/d/1/edd1d640409d6bcec135e5f0e24b8d99.png"
      ],
      "channel": "小说",
      "media_name": "豆饭小说",
      "date": "2020-03-16 05:30:44"
    },
    {
      "id": 75638190,
      "url": "https://oss-doufan-static.oss-cn-hangzhou.aliyuncs.com/swift_static/spread_2.html?d_id=6655&d_sid=1589842&d_mp=hksj",
      "title": "女孩出差给男友发照片，照片放大男友当场提分手！",
      "summary": "",
      "imgs": [
        "//dh1.cmcmcdn.com/e/f/d/e/efde2a4ab5e9c8c43fbd2d568de695ce.png"
      ],
      "channel": "小说",
      "media_name": "豆饭小说",
      "date": "2020-03-16 05:30:44"
    },
    {
      "id": 75638195,
      "url": "https://oss-doufan-static.oss-cn-hangzhou.aliyuncs.com/swift_static/spread_2.html?d_id=6656&d_sid=1589901&d_mp=hksj",
      "title": "小哥想测试一下女友，竟然亲眼目睹她给自己戴绿帽",
      "summary": "",
      "imgs": [
        "//dh1.cmcmcdn.com/7/d/6/a/7d6af702053b579ff3855bf5b558386e.png"
      ],
      "channel": "小说",
      "media_name": "豆饭小说",
      "date": "2020-03-16 05:30:44"
    },
    {
      "id": 75638186,
      "url": "https://oss-doufan-static.oss-cn-hangzhou.aliyuncs.com/swift_static/spread_2.html?d_id=6654&d_sid=1589841&d_mp=hksj",
      "title": "睡遍导演圈被封杀？当红女演员跌落神坛！",
      "summary": "",
      "imgs": [
        "//dh1.cmcmcdn.com/3/2/1/b/321bcaefc4146419195716a894da1e71.png"
      ],
      "channel": "小说",
      "media_name": "豆饭小说",
      "date": "2020-03-16 05:30:44"
    },
    {
      "id": 75638227,
      "url": "https://oss-doufan-static.oss-cn-hangzhou.aliyuncs.com/swift_static/spread_2.html?d_id=6663&d_sid=1589908&d_mp=hksj",
      "title": "志玲姐姐被爆难怀孕，遭嫌弃不敢吭声老公劈腿？",
      "summary": "",
      "imgs": [
        "//dh1.cmcmcdn.com/0/7/8/4/07841d0185fdbf3fbf14dd94f7dee944.png"
      ],
      "channel": "小说",
      "media_name": "豆饭小说",
      "date": "2020-03-16 05:30:44"
    },
    {
      "id": 75638179,
      "url": "https://oss-doufan-static.oss-cn-hangzhou.aliyuncs.com/swift_static/spread_2.html?d_id=6652&d_sid=1589791&d_mp=hksj",
      "title": "日本女生校服竟藏有这特殊用途",
      "summary": "",
      "imgs": [
        "//dh1.cmcmcdn.com/3/5/e/a/35ea6fd740e63db60cfc2ded251237d4.png"
      ],
      "channel": "小说",
      "media_name": "豆饭小说",
      "date": "2020-03-16 05:30:44"
    },
    {
      "id": 75638200,
      "url": "https://oss-doufan-static.oss-cn-hangzhou.aliyuncs.com/swift_static/spread_2.html?d_id=6657&d_sid=1589902&d_mp=hksj",
      "title": "女星和男友激吻照流出，男友是陈情令反派boss？",
      "summary": "",
      "imgs": [
        "//dh1.cmcmcdn.com/1/c/2/c/1c2c31d40ed20c3abe7c7e2ec4fa8dc2.png"
      ],
      "channel": "小说",
      "media_name": "豆饭小说",
      "date": "2020-03-16 05:30:44"
    },
    {
      "id": 75638223,
      "url": "https://oss-doufan-static.oss-cn-hangzhou.aliyuncs.com/swift_static/spread_2.html?d_id=6662&d_sid=1589907&d_mp=hksj",
      "title": "孕妇推进产房，偷偷塞给医生一纸条医生看懵",
      "summary": "",
      "imgs": [
        "//dh1.cmcmcdn.com/1/7/7/c/177c8669fa3a982b659220d08b6ad63b.png"
      ],
      "channel": "小说",
      "media_name": "豆饭小说",
      "date": "2020-03-16 05:30:44"
    },
    {
      "id": 75638213,
      "url": "https://oss-doufan-static.oss-cn-hangzhou.aliyuncs.com/swift_static/spread_2.html?d_id=6660&d_sid=1589905&d_mp=hksj",
      "title": "女明星凌晨发文痛哭！触目惊心，脖子大腿都是伤！",
      "summary": "",
      "imgs": [
        "//dh1.cmcmcdn.com/c/4/9/7/c4977261ed0128b67c1db58dbb9b9acc.png"
      ],
      "channel": "小说",
      "media_name": "豆饭小说",
      "date": "2020-03-16 05:30:44"
    },
    {
      "id": 75638204,
      "url": "https://oss-doufan-static.oss-cn-hangzhou.aliyuncs.com/swift_static/spread_2.html?d_id=6658&d_sid=1589903&d_mp=hksj",
      "title": "男女在电梯内做丢人事：监控拍下全程曝光",
      "summary": "",
      "imgs": [
        "//dh1.cmcmcdn.com/2/9/7/e/297e0601f131a4eb6ebc4126a2700dfc.png"
      ],
      "channel": "小说",
      "media_name": "豆饭小说",
      "date": "2020-03-16 05:30:44"
    }
  ]
}`);

console.log(json)
