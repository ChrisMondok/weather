enyo.kind({
	name: "cumulus.Forecast",

	classes: "row forecast nice-padding",

	published: {
		model: null
	},

	bindings: [
		{from: '.model.summary', to: '.$.summary.content'},
		{from: '.model.icon', to: '.$.icon.icon'},
		{from: '.model.precipProbability', to: '.$.pop.content', transform: function(value){return Math.round(100*value);}},
		{from: '.model.precipProbability', to: '.$.popRow.showing', transform: function(value){return Boolean(value);}},

		{from: '.model.hasTempRange', to: '.$.tempRange.showing'},
		{from: '.model.temperatureMax', to: '.$.tempMax.content', transform: cumulus.Utils.formatNumber},
		{from: '.model.temperatureMin', to: '.$.tempMin.content', transform: cumulus.Utils.formatNumber},

		{from: '.model.hasCurrentTemp', to: '.$.tempNow.showing'},
		{from: '.model.temperature', to: '.$.temp.content', transform: cumulus.Utils.formatNumber},
		{from: '.model.apparentTempIsInteresting', to: '.$.feelsLikeContainer.showing'},
		{from: '.model.apparentTemperature', to: '.$.feelsLike.content', transform: cumulus.Utils.formatNumber},

		{from: '.model.timeString', to: '.$.day.content'},
		{from: '.model.precipType', to: '.$.popLabel.content', transform: function(value) {
			return "% chance of "+(value || "precipitation");
		}}
	],

	components: [
		{classes: 'icon-box', components:[
			{name: "icon", kind: "cumulus.WeatherIcon"},
		]},
		{classes: 'text-box', components:[
			{name: "day", classes: "day title", style: "display: inline-block", content: $L("Loading")},
			{name: "tempRange", classes: "temp-range", showing: true, components: [
				{tag: 'span', name: 'tempMax'},
				{tag: 'span', content: ' / '},
				{tag: 'span', name: 'tempMin'}
			]},
			{name: "summary", classes: "weather"},
			{name: "tempNow", showing: true, components: [
				{tag: "span", name: "temp"},
				{tag: "span", classes: "label", content: "°F"},
				{tag: "span", classes: "feels-like", name: "feelsLikeContainer", components: [
					{tag: null, content: " (feels like "},
					{tag: "span", classes: "feels-like-value", name: "feelsLike"},
					{tag: null, content: " )"}
				]}
			]},
			{name: "popRow", showing: false, components: [
				{tag: "span", name: "pop"},
				{name: "popLabel", tag: "span", classes: "label", content: "% chance of precipitation"}
			]},
			{name: "humidityRow", showing: false, components: [
				{tag: "span", name: "humidity"},
				{tag: "span", classes: "label", content: "% humidity"}
			]}
		]}
	]
});
