const express = require('express');
const url = require('url');

const fetchAllCFProblems = require('./utils/fetchAllCFProblems').fetchAllCFProblems;
const fetchListOfSolvedProblems = require('./utils/fetchListOfACUserSubs').fetchListOfSolvedProblems;
const getId = require('./utils/fetchListOfACUserSubs').getId; 

const app = express();

/**
 * Default view engine which parses the views.
 */
app.set('view engine', 'ejs');
/**
 * Set the folder in which all the view files exists.
 * Express will look for view files in this folder only.
 */
app.set('views', 'views');

/**
 * Handles home page request
 */
app.get('/', (req, res, next) => {
    res.render('home');
    next();
});

/**
 * Renders the list for a user
 */
app.get('/user', (req, res, next) => {
    const handle = req.query.handle;
    console.log(handle);
    fetchListOfSolvedProblems(handle, (solvedProblems) => {
        var solvedProblemsSet = new Set();
        solvedProblems.forEach(solvedProblem => {
            solvedProblemsSet.add(getId(solvedProblem));
        });

        fetchAllCFProblems((allProblems) => {
            console.log("All problems: " + allProblems.length);
            var filteredProblems = [];

            allProblems.forEach(problem => {
                if (!solvedProblemsSet.has(getId(problem))) {
                    filteredProblems.push(problem);
                }
            });

            filteredProblems.sort((a, b)=>{
                return b.solvedCount - a.solvedCount; 
            });

            console.log("Filtered problems: " + filteredProblems.length);

            res.render('user-results', {problemList: filteredProblems});
            next();
        });
    });
});

/**
 * Spinning up the server which listens to a port.
 */
app.listen(3000);