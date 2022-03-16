
function Timing() {
	this.timings={};
}

Timing.prototype.start = function(node) {
	const ts=new Date();
	this.timings[node]=ts.getMilliseconds();
};

Timing.prototype.stop = function(node) {
	const ts=new Date();
	this.timings[node]=ts.getMilliseconds()-this.timings[node];
};

Timing.prototype.display = function(node) {
	return this.timings;
};


Timing.prototype.constructor = Timing;

module.exports = Timing;
