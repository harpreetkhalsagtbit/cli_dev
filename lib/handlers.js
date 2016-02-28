var fs = require("fs");
var exec = require('child_process').exec;
var colors = require('colors/safe');
var Promise = require('promise');
var path = require("path");

/**
 * These variables are used for making testing easier due to path issue.
 */
var executable_path = process.cwd()
var offsetPath = null;

module.exports = {
	"execute": execute,
	"printLibName": printLibName,
	"geekPerformRestAction": geekPerformRestAction,
	"geekPerformNextAction": geekPerformNextAction,
	"geekPerformPreviousAction": geekPerformPreviousAction,
	"geekPerformShowDiffAction": geekPerformShowDiffAction,
	"updateJsonFile": updateJsonFile,
	"readJsonFile": readJsonFile,
	"geekExecuteCommand": geekExecuteCommand,
	"setOffSetPathParams":setOffSetPathParams
};

function setOffSetPathParams(newOffsetPathParams) {
	if(newOffsetPathParams) {
		offsetPath = path.join.apply(this, newOffsetPathParams);
		newOffsetPathParams.unshift(executable_path)
		executable_path = path.join.apply(this, newOffsetPathParams)
	}
}

function getCommandJoiningOperator() {
	if(process.platform != "linux") {
		return "&"
	} else {
		return "&&"
	}
}
function execute(command, callback) {
	// exec(command, function(error, stdout, stderr) {
	// 	callback(error, stdout, stderr);
	// });
	var _res = exec(command).stdout.pipe(process.stdout);
	if(_res.stdout) {
		_res.stdout.pipe(process.stdout)
	}
	if(_res.stderr) {
		_res.stderr.pipe(process.stderr)
	}
	callback(_res.error, process.stdout, process.stderr)
}

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
	return new Promise(function(fulfill, reject) {
		readJsonFile(offsetPath + "/geek.json").then(function(response) {
			var json = response;
			json.index = 0
			var _cmd = (executable_path != process.cwd())?'cd ' + offsetPath + ' ' + getCommandJoiningOperator() + ' git checkout ': 'git checkout '
			geekExecuteCommand(_cmd + json.initialBranch).then(function(response) {
				updateJsonFile(offsetPath + "/geek.json", JSON.stringify(json, null, 4)).then(function(response) {
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
	return new Promise(function(fulfill, reject) {
		readJsonFile(offsetPath + "/geek.json").then(function(response) {
			var json = response;
			json.index = parseInt(json.index)
			if (json.index + 1 < json.branches.length) {
				json.index++;
				var _cmd = (executable_path != process.cwd())?'cd ' + offsetPath + ' ' + getCommandJoiningOperator() + ' git checkout ': 'git checkout '
				geekExecuteCommand(_cmd + json.initialBranch).then(function(response) {
					updateJsonFile(offsetPath + "/geek.json", JSON.stringify(json, null, 4)).then(function(response) {
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
	return new Promise(function(fulfill, reject) {
		readJsonFile(offsetPath + "/geek.json").then(function(response) {
			var json = response;
			json.index = parseInt(json.index)
			if (json.index > 0) {
				json.index--;
				var _cmd = (executable_path != process.cwd())?'cd ' + offsetPath + ' ' + getCommandJoiningOperator() + ' git checkout ': 'git checkout '
				geekExecuteCommand(_cmd + json.initialBranch).then(function(response) {
					updateJsonFile(offsetPath + "/geek.json", JSON.stringify(json, null, 4)).then(function(response) {
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
	return new Promise(function(fulfill, reject) {
		readJsonFile(offsetPath + "/geek.json").then(function(response) {
			var json = response;
			json.index = parseInt(json.index)
			console.log("json.index", json.index)
			if (json.index > 0) {
				var _cmd = (executable_path != process.cwd())?'cd ' + offsetPath + ' ' + getCommandJoiningOperator() + ' git checkout ': 'git checkout '
				geekExecuteCommand(_cmd + json.initialBranch).then(function(response) {
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
	return new Promise(function(fulfill, reject) {
		fs.writeFile(fileName, json, function(err, data) {
			if (err) reject(err);
			else {
				fulfill();
			}
		});
	});
}

function readJsonFile(fileName) {
	return new Promise(function(fulfill, reject) {
		fs.readFile(fileName, function(err, data) {
			if (err) reject(err);
			else {
				fulfill(JSON.parse(data.toString()))
			}
		});
	});
}

function geekExecuteCommand(command) {
	return new Promise(function(fulfill, reject) {
			console.log("executing ", command)
		execute(command, function(err, stdout, stderr) {
			console.log("executed")
			if (err) reject(err);
			else {
			console.log("executed", err, stdout, stderr)
				if (stdout) {
					console.log('Program stdout:', colors.green(stdout));
				} else if (stderr) {
					console.log('Program stderr:', colors.red(stderr));
				}
				fulfill();
			}
		});
	});
}