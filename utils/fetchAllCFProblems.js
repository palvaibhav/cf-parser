const https = require('https');

const host = 'codeforces.com';
const endpoint = '/api/problemset.problems';

exports.fetchAllCFProblems = (callback) => {
    var options = {
        host: host,
        path: endpoint
    };

    var req = https.request(options, (res) => {
        res.setEncoding('utf-8');

        var responseString = '';

        res.on('data', (data) => {
            responseString += data;
        });

        res.on('end', function() {
            var responseObject = JSON.parse(responseString);
            var problemStats = responseObject.result.problemStatistics;
            callback(problemStats);
        });
    });

    req.end();
};

