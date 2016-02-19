#!/usr/bin/env node

var program = require('commander');
require('shelljs/global');
var fs = require("fs");

if (!which('git')) {
    echo('Sorry, this script requires git');
    exit(1);
}

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
                    exec('git checkout ' + _json.hashes[_json.index], {
                        async: true
                    }, function(code, stdout, stderr) {
                        console.log('Exit code:', code);
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

program
    .command('reset')
    .description('initialize project configuration')
    .action(function(name) {
        fs.readFile(process.cwd() + "/geek.json", function(err, data) {
            if (err) {
                console.log(err)
            } else {
                var _json = JSON.parse(data.toString())
                _json.index = parseInt(_json.index)
                _json.index = 0;
                console.log("Resetting previous changes...")
                fs.writeFile(process.cwd() + "/geek.json", JSON.stringify(_json), function(err, data) {
                    exec('git checkout ' + _json.branch, {
                        async: true
                    }, function(code, stdout, stderr) {
                        console.log("Reset done")
                    });
                });
            }
        })
    });


program
    .command('next')
    .description('initialize project configuration')
    .action(function(name) {
        fs.readFile(process.cwd() + "/geek.json", function(err, data) {
            if (err) {
                console.log(err)
            } else {
                var _json = JSON.parse(data.toString())
                _json.index = parseInt(_json.index)
                _json.index++;
                exec('git checkout ' + _json.hashes[_json.index], {
                    async: true
                }, function(code, stdout, stderr) {
                    console.log('Exit code:', code);
                    console.log('Program output:', stdout);
                    console.log('Program stderr:', stderr);
                    fs.writeFile(process.cwd() + "/geek.json", JSON.stringify(_json), function(err, data) {
                    });
                });

            }
        })
    });

program
    .command('previous')
    .description('initialize project configuration')
    .action(function(name) {
        fs.readFile(process.cwd() + "/geek.json", function(err, data) {
            if (err) {
                console.log(err)
            } else {
                var _json = JSON.parse(data.toString())
                _json.index = parseInt(_json.index)
                _json.index--;
                exec('git checkout ' + _json.hashes[_json.index], {
                    async: true
                }, function(code, stdout, stderr) {
                    console.log('Exit code:', code);
                    console.log('Program output:', stdout);
                    console.log('Program stderr:', stderr);
                    fs.writeFile(process.cwd() + "/geek.json", JSON.stringify(_json), function(err, data) {
                    });
                });

            }
        })
    });


program
    .command('bye [name]')
    .description('initialize project configuration')
    .action(function(name) {
        console.log('Bye ' + name + '. It was good to see you!');
    });

// program
//     .command('*')
//     .action(function(env) {
//         console.log('Enter a Valid command');
//         terminate(true);
//     });

program.parse(process.argv);