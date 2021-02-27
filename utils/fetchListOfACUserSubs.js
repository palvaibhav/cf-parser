const https = require('https');

const host = 'codeforces.com';
const endpoint = '/api/user.status';
const OK_VERDICT = 'OK';

const fetchListOfSolvedProblems = (handle, callback) => {
    var options = {
        host: host,
        path: endpoint + '?' + 'handle=' + handle + '&from=1'
    };

    var req = https.request(options, (res) => {
        res.setEncoding('utf-8');

        var responseString = '';

        res.on('data', (data) => {
            responseString += data;
        });

        res.on('end', function() {
            var responseObject = JSON.parse(responseString);
            //console.log("Returned object : \n" + responseObject.result);
            var solvedProblems = parseAllSubsAndGetSolvedProblemsList(responseObject.result);
            callback(solvedProblems);
        });
    });

    req.end();
};

const parseAllSubsAndGetSolvedProblemsList = (allSubs) => {
    var acProblems = getListOfOkVerdictProblems(allSubs);
    console.log("AC PROBLEMS : " + acProblems.length);
    var uniqueIds = new Set();
    var uniqueProblems = [];
    acProblems.forEach(problem => {
        if (!uniqueIds.has(getId(problem))) {
            uniqueProblems.push(problem);
            uniqueIds.add(getId(problem));
        }
    });
    console.log("Unique Problems : " + uniqueIds.size);
    return uniqueProblems;
};

const getListOfOkVerdictProblems = (allSubs) => {
    //console.log(typeof allSubs);
    var result = [];
    allSubs.forEach(sub => {
        if (sub.verdict == OK_VERDICT) {
            result.push(sub.problem);
        }
    });
    return result;
};

const getId = (problem) => {
    var id = problem.contestId + problem.index;
    //console.log("ID : " + id + "\n");
    //console.log(typeof id);
    return id;
};

module.exports = {
    fetchListOfSolvedProblems: fetchListOfSolvedProblems,
    getId: getId
}
