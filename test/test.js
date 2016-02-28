var assert = require('assert');
var geekHandler = require("../lib/handlers");
var path = require("path");

// console.log(path.join.apply(this, ["test", "repo"]))
describe('Array', function() {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
    	console.log("Running Tests for path: ", path.join(process.cwd(), "test", "repo"))
    	geekHandler.setOffSetPathParams(["test", "repo"])
    	console.log("Running Tests for path: ", path.join(process.cwd(), "test", "repo"))
		geekHandler.geekPerformRestAction("test/repo").then(function() {
			console.log("hhdone  done")
		})
    	console.log("Running Tests for path: ", path.join(process.cwd(), "test", "repo"))
		assert.equal(-1, [1,2,3].indexOf(5));
		assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});

/*
var assert = require('assert');
var geekHandler = require("../lib/handlers");
var path = require("path");

describe('Geek Command Handlers', function() {
  describe('exeute', function () {
    it('execute shell command(geek test) and it should return a result', function () {
    	var fs = require('fs');
    	var child = require('child_process');

    	var out = fs.openSync('/tmp/daemon.log', 'a');
    	var options = {
    	    cwd: process.cwd(),
    	    env: process.env,
    	    detached: true,
    	    stdio: ['ignore', out, process.stderr]
    	};
		var proc = child.spawn("geek te", {}, {});
		proc.stdout.pipe(process.stdout);
		proc.stderr.pipe(process.stderr);

		proc.on('close', function () {
			proc.stdout.unpipe(process.stdout);
			proc.stderr.unpipe(process.stderr);
			console.log(proc.stdout);
			console.log(proc.stderr);
		});
		proc.on('error', function (err) {
			console.log(err);
		});

    });
  });
});
*/

  /*
  var JS = require("jstest"),
	child = require("child_process"),
	path = require("path"),
	concat = require("concat-stream")



JS.Test.describe("add", function() { with(this) {
	before(function() { with(this) {
		this.executable = path.join(__dirname, "test", "repo")
	}})

	it("test geek", function(resume) { with(this) {
		var proc = child.spawn(executable, ["geek"])

		proc.stdout.pipe(concat(function(output) {
			var res = output.toString("utf-8")
			resume(function() {
				console.log(res)
			})
		}))

		proc.stderr.pipe(concat(function(output) {
			var res = output.toString("utf-8")
			resume(function() {
				console.log(res)
			})
		}))

	}})

}})

   */