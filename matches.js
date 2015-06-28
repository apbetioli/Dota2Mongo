var config = require('config');
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/dota', ['matches']);
var util = require('./util');

var counter = 1;

db.matches.find().sort({match_seq_num:1}).limit(1, function(err, docs) {
    getMatches(docs[0].match_seq_num);
});

function getMatches(lastMatchSeqNum) {
    var url = "http://api.steampowered.com/IDOTA2Match_570/GetMatchHistoryBySequenceNum/V001?key=" + config.get('apikey');
    if (lastMatchSeqNum)
        url += "&start_at_match_seq_num=" + lastMatchSeqNum;

    console.log(counter + ' ' + util.time() + ' ' + url);

    util.get(url, function (result) {
        for (i in result.matches) {
            var match = result.matches[i];
            persist(match);
        }

        counter++;
        getMatches(lastMatchSeqNum-100);
    });
}

var persist = function(result) {
    try {
        if (!result.match_id) {
            console.log('Invalid match: ' + result.match_id + ' - ' + JSON.stringify(result));
            return;
        }

        util.insertMatch(db, result);
    } catch (e) {
        console.log(e);
        throw e;
    }
}

/*
function getMatch(match_id) {
    var url = "http://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/V001/?match_id=" + match_id + "&key=" + config.get('apikey');
    util.get(match_id, url, persist);
}
*/