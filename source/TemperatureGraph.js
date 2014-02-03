enyo.kind({
	name:"Cumulus.TemperatureGraph",
	kind:"Cumulus.Graph",

	published:{
		step:10
	},

	collectionChanged:function(old, collection) {
		var key = this.getKey(), step = this.getStep(),
			temps = [];

		if(collection)
			temps = collection.map(function(m){return m.get(key);});

		if(temps.length) {
			var min = temps.reduce(function(a,b){return Math.min(a,b);});
			var max = temps.reduce(function(a,b){return Math.max(a,b);});

			this.setMin(Math.floor((min-1)/step)*step);
			this.setMax(Math.ceil((max+1)/step)*step);
			this.setShowLabels(true);
			this.resizeHandler();
		}
		else
			this.setShowLabels(false);

		this.inherited(arguments);
	},

	drawGraphLines:function(animStep) {
		this.inherited(arguments);

		var step = this.getStep(),
			amount = animStep;

		for(var i = this.min; i < this.max; i+=step) {
			var y = this.valueToY(i);
			this._ctx.beginPath();
			this._ctx.moveTo(0,this.valueToY(i));
			this._ctx.lineTo(this.$.canvas.getBounds().width * amount,this.valueToY(i));
			this._ctx.stroke();
			this._ctx.closePath();
		}

	}
});
