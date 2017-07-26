

var R = require("r-script");

R("script.r").data([1,2,3,4,5]).call(function(err, d) {
    if (err) throw err;
    console.log(d);
});