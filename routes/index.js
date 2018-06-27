const express = require('express');
const router = express.Router();
const client = require('cheerio-httpcli');

////////////////////
const fs = require('fs');
const all_pages = []
// ダウンロードマネージャーの設定(全ダウンロードイベントがここで処理される)
client.download
.on('ready', function (stream) {
  stream.pipe(fs.createWriteStream('pictures/'+href+'.jpg'));
  console.log(stream.url.href + 'をダウンロードしました');
})
.on('error', function (err) {
  console.error(err.url + 'をダウンロードできませんでした: ' + err.message);
})
.on('end', function () {
  console.log('ダウンロードが完了しました');
});
 
// 並列ダウンロード制限の設定
client.download.parallel = 4;
router.get('/happou', function(req, res, next) {
  let resJson = {};
  resJson.header = 'this is url list';
  resJson.title = 'sample title'; 
  resJson.link = [];
  for(let i=0;i < all_pages.length ; i++){
    client.fetch(all_pages[i], function (err, $, res, body) {
      //画像を全部ダウンロード:ストリーム処理がうまくいかないので、リンク吐き出し
      $('img#img').download();
      resJson.link.push({url: $('img#img').attr('src')});//うまくいかない
      console.log(i+"ページ目");
      console.log($('img#img').attr('src'));
    });
  }
  res.header('Content-Type', 'application/json; charset=utf-8');
  res.send(resJson);
});
////////////////////

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const word = 'vue.js';
/* /scarping にアクセスするとスクレイピング結果をJSONで返す */
router.get('/scraping', function(req, res, next) {
  client.fetch('http://www.google.co.jp/search', { q: word }, function (err, $, result) {
    let resJson = {};

    resJson.header = result.headers;
    resJson.title = $('title').text(); // jQueryのセレクタと同じ要領で要素を取得できる 
    resJson.link = [];

    // 検索結果が個別に格納されている要素をループ
    $('#rso .g').each(function () {
      // 各検索結果のタイトル部分とURL、概要を取得
      let $h3 = $(this).find('h3');
      let url = $h3.find('a').attr('href');
      if (url) {
        resJson.link.push({
          title: $h3.text(),
          url: url,
          description: $(this).find('.st').text()
        });
      }
    });
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.send(resJson);
  });
});

module.exports = router;
