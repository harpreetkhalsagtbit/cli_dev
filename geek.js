#!/usr/bin/env node

var program = require('commander');
var fs = require("fs");
var fse = require('fs-extra')
var exec = require('child_process').exec;
var colors = require('colors/safe');

program
    .version('0.0.1')

program
    .command('init')    
    .description('initialize tutorial')
    .action(function() {

        //Checkout to topmost git commit using - git commit's hash value as provided
        //in geek.json file of the source repository

        /**
         * cd to current directory in which cli command has been executed
         */
        cd(process.cwd())

        /**
         * Read the content of JSON file, configuration, and checkout to hash index specified
         */
        fs.readFile(process.cwd() + "/geek.json", function(err, data) {
            if (err) {
                console.log(err)
            } else {
                if(data && data.toString) {
                    var _json = JSON.parse(data.toString())
                    exec('git checkout ' + _json.branches[_json.index], function(error, stdout, stderr) {
                        console.log('Exit code:', error);
                        console.log('');
                        console.log('Program output:', stdout);
                        console.log('');
                        console.log('Program stderr:', stderr);
                        console.log('');
                    });
                } else {
                    console.log("error initializing")
                }
            }
        })
    });

// program
//     .command('reset')
//     .description('Reset all changes and Initialize')
//     .action(function(name) {
//         fs.readFile(process.cwd() + "/geek.json", function(err, data) {
//             if (err) {
//                 console.log(err)
//             } else {
//                 printLibName();
//                 var _json = JSON.parse(data.toString())
//                 _json.index = parseInt(_json.index)
//                 _json.index = 0;
//                 console.log("Resetting previous changes...")
//                 fs.writeFile(process.cwd() + "/geek.json", JSON.stringify(_json, null, 4), function(err, data) {
//                     execute('git checkout ' + _json.initialBranch, function(error, stdout, stderr) {
//                         console.log("Reset done")
//                     });
//                 });
//             }
//         })
//     });

program
    .command('reset')
    .description('Reset all changes and Initialize')
    .action(function(name) {
        execute('git checkout -f geek-config', function(error, stdout, stderr) {
            console.log("Reset done")
            fse.copy(process.cwd() + "/geek.config.json", process.cwd() + "/geek.json", {
                "clobber":true
            }, function() {
                fs.readFile(process.cwd() + "/geek.json", function(err, data) {
                    if (err) {
                        console.log(err)
                    } else {
                        printLibName();
                        var _json = JSON.parse(data.toString())
                        _json.index = parseInt(_json.index)
                        _json.index = 0;
                        console.log("Resetting previous changes...")
                        fs.writeFile(process.cwd() + "/geek.json", JSON.stringify(_json, null, 4), function(err, data) {
                        });
                    }
                })
            })
        });
    });

program
    .command('showdiff')
    .description('show diff between current and last commit - defined in geek.json file of current repository')
    .action(function(name) {
        fs.readFile(process.cwd() + "/geek.json", function(err, data) {
            if (err) {
                console.log(err)
            } else {
                var _json = JSON.parse(data.toString())
                _json.index = parseInt(_json.index)
                if(_json.index+1 < _json.branches.length) {
                    _json.index++;
                    execute('git diff ' + _json.branches[_json.index - 1] + " " + _json.branches[_json.index], function(error, stdout, stderr) {
                        console.log('Program output:', colors.green(stdout));
                    });
                } else {
                    console.log("Unable to move Next...")
                }
            }
        })
    });

program
    .command('next')
    .description('Jumt to Next Step - defined in geek.json file of current repository')
    .action(function(name) {
        fs.readFile(process.cwd() + "/geek.json", function(err, data) {
            if (err) {
                console.log(err)
            } else {
                var _json = JSON.parse(data.toString())
                _json.index = parseInt(_json.index)
                if(_json.index+1 < _json.branches.length) {
                    _json.index++;
                    execute('git checkout ' + _json.branches[_json.index], function(error, stdout, stderr) {
                        // console.log('Exit code:', error);
                        // console.log('Program output:', stdout);
                        console.log('Program stderr:', colors.red(stderr));
                        fs.writeFile(process.cwd() + "/geek.json", JSON.stringify(_json, null, 4), function(err, data) {
                        });
                    });
                } else {
                    console.log("Unable to move Next...")
                }
            }
        })
    });

program
    .command('previous')
    .description('Jumt to Previous Step - defined in geek.json file of current repository')
    .action(function(name) {
        fs.readFile(process.cwd() + "/geek.json", function(err, data) {
            if (err) {
                console.log(err)
            } else {
                var _json = JSON.parse(data.toString())
                _json.index = parseInt(_json.index)
                if(_json.index > 0) {
                    _json.index--;
                    execute('git checkout ' + _json.branches[_json.index], function(error, stdout, stderr) {
                        console.log('Program stderr:', colors.red(stderr));
                        fs.writeFile(process.cwd() + "/geek.json", JSON.stringify(_json, null, 4), function(err, data) {
                        });
                    });
                } else {
                    console.log("Unable to move Previous...")
                }
            }
        })
    });

// program
//     .command('*')
//     .action(function(env) {
//         console.log('Enter a Valid command');
//         terminate(true);
//     });

program.parse(process.argv);


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