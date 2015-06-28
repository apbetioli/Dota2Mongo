var request = require('request');

var get = function (url, callback) {
    request({
        url: url,
        json: true,
        pool: {maxSockets: Infinity},
        timeout: 30000,
        time: true
    }, function (error, response, body) {
        if (response && response.statusCode === 200) {
            callback(body.result);
        } else {
            console.log('Request Error: ' + error ? error : JSON.stringify(response));
            console.log('Waiting and trying again');
            setTimeout(function () {
                get(url, callback);
            }, 30000);
        }
    });
}

exports.get = get;

var insertMatch = function (db, match, done) {
    db.matches.count({match_seq_num: match.match_seq_num}, function (err, result) {
        if (err) {
            console.log(err);
            throw err;
        }

        if (result == 0) {

            db.matches.insert(match, function (err, result) {
                if (err) {
                    console.log(err);
                    throw err;
                }

                console.log("Match inserted: " + result.match_seq_num);
            });

        } else {
            console.log("Match already exists: " + match.match_seq_num);
        }

    });
};

exports.insertMatch = insertMatch;

var insertHero = function (db, hero) {
    db.heroes.count({id: hero.id}, function (err, result) {
        if (err) {
            console.log(err);
            throw err;
        }

        if (result == 0) {

            db.heroes.insert(hero, function (err, result) {
                if (err) {
                    console.log(err);
                    throw err;
                }

                console.log("Hero inserted: " + hero.localized_name);
            });

        } else {
            console.log("Hero already exists: " + hero.localized_name);
        }

    });
};

exports.insertHero = insertHero;

var time = function() {
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    return hour + ":" + min + ":" + sec;
};

exports.time = time;