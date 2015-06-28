var config = require('config');
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/dota', ['heroes']);
var util = require('./util');

var url = "https://api.steampowered.com/IEconDOTA2_570/GetHeroes/v0001?language=en_us&key=" + config.get('apikey');
console.log(url);

util.get(url, function(result) {
    for(var i in result.heroes) {
        var hero = result.heroes[i];
        util.insertHero(db, hero);
    }
});
