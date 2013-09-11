enyo.kind({
	name:"Cumulus.Forecast",

	classes:"row forecast nice-padding",

	published:{
		data:{},

		now:false,
		hourly:false,

		showDay:true,
		showHumidity:false,
		showTemp:true,
		showRange:true,
		showWeather:true,
		showPop:true
	},

	components:[
		{name:"icon", kind:"Cumulus.WeatherIcon"},
		{name:"day", classes:"day title", content:$L("Loading")},
		{name:"weather"},
		{name:"tempNow", showing:false, components:[
			{tag:"span", name:"temp"},
			{tag:"span", classes:"label", content:" (feels like "},
			{tag:"span", name:"feelsLike"},
			{tag:"span", classes:"label", content:" °F)"}
		]},
		{name:"tempRange", showing:false, classes:"temp-range", components:[
			{kind:"Image", src:"assets/icons/temp-min.png"},
			{tag:"span", name:"minTemp"},
			{tag:"span", content:" - "},
			{kind:"Image", src:"assets/icons/temp-max.png"},
			{tag:"span", name:"maxTemp"}
		]},
		{name:"popRow", showing:false, components:[
			{tag:"span", name:"pop"},
			{tag:"span", classes:"label", content:"% chance of precipitation"}
		]},
		{name:"humidityRow", showing:false, components:[
			{tag:"span", name:"humidity"},
			{tag:"span", classes:"label", content:"% humidity"}
		]}
	],

	dataChanged:function() {
		var data = this.getData();
		if(data) {
			this.$.day.setContent(this.transformDate(data.dateTimeISO));
			this.$.icon.setIcon(data.icon);

			this.$.weather.setContent(data.weather);
			
			if(data.tempF === undefined || data.tempF === null)
				this.$.temp.setContent(data.avgTempF + "°F");
			else
				this.$.temp.setContent(data.tempF + "°F");
			
			this.$.feelsLike.setContent(data.feelslikeF);
			this.$.minTemp.setContent(data.minTempF);
			this.$.maxTemp.setContent(data.maxTempF);
			this.$.pop.setContent(data.pop);
			this.$.humidity.setContent(data.humidity);
		}

		this.updateShowing();
	},

	updateShowing:function() {
		var data = this.getData();

		this.$.day.setShowing(data && this.getShowDay() && data.hasOwnProperty('dateTimeISO'));
		this.$.weather.setShowing(data && this.getShowWeather() && data.hasOwnProperty('weather'));

		this.$.popRow.setShowing(data && this.getShowPop() && data.pop); //don't show if it's zero.

		this.$.humidityRow.setShowing(data && this.getShowHumidity() && data.hasOwnProperty('humidity'));

		this.$.tempRange.setShowing(this.getShowRange() && data.hasOwnProperty('maxTempF'));

		this.$.tempNow.setShowing(this.getShowTemp() && data.hasOwnProperty('tempF') || data.hasOwnProperty('avgTempF'));
	},

	transformDate:function(value) {
		if(this.getNow())
			return $L('now');
		if(value) {
			var date = new Date(value);

			if(this.getHourly()) {
				date.setMinutes(0);
				date.setSeconds(0);
				date.setMilliseconds(0);
				return Cumulus.Main.formatTime(date);
			}
			else {
				return Cumulus.Main.formatDay(date);
			}
		}
		return value;
	}
});
