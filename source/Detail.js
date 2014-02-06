enyo.kind({
	name:"Cumulus.Detail",
	kind:"FittableRows",

	classes:"detail",

	published:{
		forecast: null,

		model: null,

		conditions:null,
		hourly:null,

		graphAnimator:null
	},

	bindings:[
		{from: '.model.summary', to: '.$.summary.content'},
		{from: '.model.hourly', to: '.$.popGraph.collection'},
		{from: '.model.hourly', to: '.$.tempGraph.collection'},
		{from: '.model.hourly', to: '.$.humidityGraph.collection'},
		{from: '.model.precipProbability', to: '.$.popDrawer.open', transform: function(p){return p > 0.1;}},
		{from: '.model', to: '.$.normals.model'},
		{from: '.conditions', to: '.$.conditionRepeater.collection'},
		{from: '.forecast.daily', to: '.$.dayCarousel.collection'}
	],

	components:[
		{kind: 'enyo.Router', routes:[
			{path:'detail/:time', handler: 'routeHandler', context: 'owner'}
		]},
		{classes: 'today', components:[
			{name: 'dayCarousel', kind: 'DataRepeater', containerOptions:{
					kind: 'enyo.Panels',
					style:"height: 40px",
					arrangerKind: 'CarouselArranger',
					onTransitionFinish: 'dayCarouselChanged'
				}, components:[
				{components:[
					{name: 'day', classes:'title'},
					{name: 'summary'}
				], bindings:[
					{from: '.model.timeString', to: '.$.day.content'},
					{from: '.model.summary', to: '.$.summary.content'}
				]}
			]}
		]},
		{fit:true, style:"position:relative", components:[
			{name:"loadingPopup", kind:"Cumulus.LoadingPopup"},
			{name:"scroller", kind:"Scroller", thumb:false, horizontal:"hidden", classes:"scroller dark enyo-fit", components:[
				{name:"popDrawer", kind:"Drawer", components:[
					{classes:"divider", content:"Chance of precipitation"},
					{
						name:"popGraph",
						kind:"Cumulus.Graph",
						classes:"group",
						key:"precipProbability",
						min:0, max:1,
						fillColor:"rgba(132,167,193,0.5)",
						strokeColor:"rgba(132,167,193,1)"
					}
				]},
				{classes:"divider", content:"Temperature"},
				{
					name:"tempGraph",
					classes:"group",
					kind:"Cumulus.TemperatureGraph",
					key:"temperature",
					fillColor:"rgba(255,0,0,0.25)",
					strokeColor:"rgba(255,0,0,1)"
				},
				{classes:"divider", content:"Humidity"},
				{
					name:"humidityGraph",
					classes:"group",
					kind:"Cumulus.Graph",
					key:"humidity",
					min:0, max:1,
					fillColor:"rgba(255,255,255,0.25)",
					strokeColor:"rgba(255,255,255,0.75)"
				},
				{classes:"divider", content:"Conditions"},
				{name: "conditionRepeater", kind: "DataRepeater", classes: "group", components: [
					{classes:'row condition nice-padding', components:[
						{name:"icon", kind:"Cumulus.WeatherIcon"},
						{name:"timespan", classes:"title"},
						{name:"summary", content: 'summary'}
					], bindings:[
						{from: '.model.summary', to: '.$.summary.content'},
						{from: '.model.icon', to: '.$.icon.icon'},
						{from: '.model.timespan', to: '.$.timespan.content'}
					]}
				]},
				{name:"normals",  kind:"Cumulus.Normals"},
				{classes:"command-menu-placeholder"}
			]}
		]}
	],

	routeHandler: function(time) {
		this.setModel(enyo.store.findLocal(Cumulus.models.Daily, {time: time}));
	},

	create:function() {
		this.inherited(arguments);

//		var today = new Date();
//		today.setHours(0,0,0,0);
//
//		for(var i = 0; i < 7; i++) {
//			var day = this.$.dayCarousel.createComponent({
//				classes:"title",
//				content:Cumulus.Main.formatDay(new Date(today.getTime() + 24*60*60*1000*i))
//			});
//			day.render();
//		}
//		this.$.dayCarousel.reflow();
//
		this.setGraphAnimator(
			this.createComponent({name:"animator", kind:"Animator", onStep:"drawGraphs", duration:750})
		);
	},

	graphAnimatorChanged:function(oldAnimator, animator) {
		this.$.popGraph.setAnimator(animator);
		this.$.tempGraph.setAnimator(animator);
		this.$.humidityGraph.setAnimator(animator);
	},

	drawGraphs:function() {
		this.$.popGraph.drawGraph();
		this.$.tempGraph.drawGraph();
		this.$.humidityGraph.drawGraph();
	},

	setupCarouselItem:function(repeater, event) {
		var today = new Date();
		event.item.$.day.setContent(
			Cumulus.Main.formatDay(new Date(today.getTime() + 24*60*60*1000*event.index))
		);

		return true;
	},
	dayCarouselChanged:function(carousel, event) {
		console.log("Day carousel changed!");
//		if(event.fromIndex == event.toIndex)
//			return;
//
//		var today = new Date();
//		today.setHours(0,0,0,0);
//		var newDay = today.getTime() + event.toIndex * 24*60*60*1000;
//		this.setDay(new Date(newDay));
	},

	modelChanged: function() {
		this.getGraphAnimator().play();
		this.set('conditions', this.calculateConditions());
	},

	calculateConditions:function() {
		var conditions = [];

		var hourly = this.getModel().get('hourly');

		for(var i = 0; i < hourly.length; i++) {
			var hour = hourly.at(i),
				summary = hour.get('summary'),
				time = hour.get('time'),
				icon = hour.get('icon');

			var lastCondition = conditions[conditions.length - 1];

			if(lastCondition)
				lastCondition.end = hour.get('time');
			if(!lastCondition || lastCondition.summary != summary || lastCondition.icon != icon)
				conditions.push({ summary: summary, icon: icon, start: time, end: time + 1000*60*60 });
		}

		return new Cumulus.collections.Conditions(conditions);
	}
});
