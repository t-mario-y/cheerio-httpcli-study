var express = require('express');
var router = express.Router();
var client = require('cheerio-httpcli');
 
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const word = 'vue.js';
/* /scarping にアクセスするとスクレイピング結果をJSONで返す */
router.get('/scraping', function(req, res, next) {
  client.fetch('http://www.google.co.jp/search', { q: word }, function (err, $, result) {
    var resJson = {};

    resJson.header = result.headers;
    resJson.title = $('title').text(); // jQueryのセレクタと同じ要領で要素を取得できる 
    resJson.link = [];

    // 検索結果が個別に格納されている要素をループ
    $('#rso .g').each(function () {
      // 各検索結果のタイトル部分とURL、概要を取得
      var $h3 = $(this).find('h3');
      var url = $h3.find('a').attr('href');
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
