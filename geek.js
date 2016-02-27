#!/usr/bin/env node

var program = require('commander');
var fs = require("fs");
var exec = require('child_process').exec;
var colors = require('colors/safe');
var Promise = require('promise');

program
    .version('0.0.1')

program
    .command('reset')
    .description('Reset all changes and Initialize')
    .action(function(name) {
        printLibName();
        geekPerformRestAction().then(function() {
            console.log("Reset done")
        }, function(err) {
            console.error("geekPerformShowDiffAction: ", err)
        }).catch(function(err) {
            console.log(err.stack);
        });
    });

program
    .command('showdiff')
    .description('show diff between current and last commit - defined in geek.json file of current repository')
    .action(function(name) {
        geekPerformShowDiffAction().then(function() {
            console.log("Diff done")
        }, function(err) {
            console.error("geekPerformShowDiffAction: ", err)
        }).catch(function(err) {
            console.log(err.stack);
        });
    });

program
    .command('next')
    .description('Jumt to Next Step - defined in geek.json file of current repository')
    .action(function(name) {
        geekPerformNextAction().then(function() {
            console.log("Next done")
        }, function(err) {
            console.error("geekPerformNextAction: ", err)
        }).catch(function(err) {
            console.log(err.stack);
        });
    });

program
    .command('previous')
    .description('Jumt to Previous Step - defined in geek.json file of current repository')
    .action(function(name) {
        geekPerformPreviousAction().then(function() {
            console.log("Previous done")
        }, function(err) {
            console.error("geekPerformPreviousAction: ", err)
        }).catch(function(err) {
            console.log(err.stack);
        });
    });


program.parse(process.argv);

/**
 * Functions starts from here
 */

var exec = require('child_process').exec;
function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(error, stdout, stderr); });
};

function printLibName() {
    console.log(colors.green("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*"));
    console.log(colors.green("*                                                     *"));
    console.log(colors.green("*    ***    ****   ****   *   *  *****  ****  *   *   *"));
    console.log(colors.green("*   *       *      *      * *      *    *      * *    *"));
    console.log(colors.green("*   *  ***  ***    ***    **       *    ***     *     *"));
    console.log(colors.green("*   *   *   *      *      * *      *    *       *     *"));
    console.log(colors.green("*    ****   ****   ****   *   *  *****  *       *     *"));
    console.log(colors.green("*                                                     *"));
    console.log(colors.green("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*"));
}

function geekPerformRestAction() {
    return new Promise(function (fulfill, reject){
        readJsonFile(process.cwd() + "/geek.json").then(function(response) {
            var json = response;
            json.index = 0
            geekExecuteCommand('git checkout ' + json.initialBranch).then(function(response) {
                updateJsonFile(process.cwd() + "/geek.json", JSON.stringify(json, null, 4)).then(function(response) {
                    fulfill();
                }, function(err) {
                    console.error("updateJsonFile: ", err)
                }).catch(function(err) {
                    console.log(err.stack);
                });
            }, function(err) {
                console.error("geekExecuteCommand: ", err)
            }).catch(function(err) {
                console.log(err.stack);
            });
        }, function(err) {
            console.error("readJsonFile: ", err)
        }).catch(function(err) {
            console.log(err.stack);
        });
    });
}

function geekPerformNextAction() {
    return new Promise(function (fulfill, reject){
        readJsonFile(process.cwd() + "/geek.json").then(function(response) {
            var json = response;
            json.index = parseInt(json.index)
            if(json.index+1 < json.branches.length) {
                json.index++;
                geekExecuteCommand('git checkout ' + json.branches[json.index]).then(function(response) {
                    updateJsonFile(process.cwd() + "/geek.json", JSON.stringify(json, null, 4)).then(function(response) {
                        fulfill();
                    }, function(err) {
                        console.error("updateJsonFile: ", err)
                    }).catch(function(err) {
                        console.log(err.stack);
                    });
                }, function(err) {
                    console.error("geekExecuteCommand: ", err)
                }).catch(function(err) {
                    console.log(err.stack);
                });
            } else {
                reject(new Error("Unable to move Next..."))
            }
        }, function(err) {
            console.error("readJsonFile: ", err)
        }).catch(function(err) {
            console.log(err.stack);
        });
    });
}

function geekPerformPreviousAction() {
    return new Promise(function (fulfill, reject){
        readJsonFile(process.cwd() + "/geek.json").then(function(response) {
            var json = response;
            json.index = parseInt(json.index)
            if(json.index > 0) {
                json.index--;
                geekExecuteCommand('git checkout ' + json.branches[json.index]).then(function(response) {
                    updateJsonFile(process.cwd() + "/geek.json", JSON.stringify(json, null, 4)).then(function(response) {
                        fulfill();
                    }, function(err) {
                        console.error("updateJsonFile: ", err)
                    }).catch(function(err) {
                        console.log(err.stack);
                    });
                }, function(err) {
                    console.error("geekExecuteCommand: ", err)
                }).catch(function(err) {
                    console.log(err.stack);
                });
            } else {
                reject(new Error("Unable to move Next..."))
            }
        }, function(err) {
            console.error("readJsonFile: ", err)
        }).catch(function(err) {
            console.log(err.stack);
        });
    });
}

function geekPerformShowDiffAction() {
    return new Promise(function (fulfill, reject){
        readJsonFile(process.cwd() + "/geek.json").then(function(response) {
            var json = response;
            json.index = parseInt(json.index)
            console.log("json.index", json.index)
            if(json.index> 0) {
                geekExecuteCommand('git diff ' + json.branches[json.index - 1] + " " + json.branches[json.index]).then(function(response) {
                    console.log("Diff done")
                }, function(err) {
                    console.error("geekExecuteCommand: ", err)
                }).catch(function(err) {
                    console.log(err.stack);
                });
            } else {
                reject(new Error("No diff to show..."))
            }
        }, function(err) {
            console.error("readJsonFile: ", err)
        }).catch(function(err) {
            console.log(err.stack);
        });
    });
}

function updateJsonFile(fileName, json) {
    return new Promise(function (fulfill, reject){
        fs.writeFile(fileName, json, function(err, data) {
            if (err) reject(err);
            else {
                fulfill();
            }
        });
    });
}

function readJsonFile(fileName) {
    return new Promise(function (fulfill, reject){
        fs.readFile(fileName, function(err, data) {
            if (err) reject(err);
            else {
                fulfill(JSON.parse(data.toString()))
            }
        });
    });
}

function geekExecuteCommand(command) {
    return new Promise(function (fulfill, reject){
        execute(command, function(err, stdout, stderr) {
            if (err) reject(err);
            else {
                if(stdout) {
                    console.log('Program stdout:', colors.green(stdout));
                } else if(stderr) {
                    console.log('Program stderr:', colors.red(stderr));
                }
                fulfill();
            }
        });
    });
}