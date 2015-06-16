myApp.directive('stonegraph', function() {
	return {
		restrict: 'E',
		scope : {
			stones: '=',
			active: '='
		},
		replace: true,
		templateUrl : 'js/directives/stoneGraph.html',
		link : function (scope, element, attrs) {
			scope.init = initGraph;
		}
	};
});

function initGraph() {

	var dataset = {
        nodes: [
                { name: "Adam" },
                { name: "Bob" },
                { name: "Carrie" },
                // { name: "Donovan" },
                // { name: "Edward" },
                // { name: "Felicity" },
                // { name: "George" },
                // { name: "Hannah" },
                // { name: "Iris" },
                // { name: "Jerry" }
        ],
        edges: [
                { source: 0, target: 1 },
                { source: 0, target: 2 },
                // { source: 0, target: 3 },
                // { source: 0, target: 4 },
                // { source: 1, target: 5 },
                // { source: 2, target: 5 },
                // { source: 2, target: 5 },
                // { source: 3, target: 4 },
                // { source: 5, target: 8 },
				// { source: 5, target: 9 },
				// { source: 6, target: 7 },
				// { source: 7, target: 8 },
				// { source: 8, target: 9 }
		]
	};

	var w = 700;
	var h = 800;
	var colors = d3.scale.category10();
	
	var zoom = d3.behavior.zoom()
		.scaleExtent([1, 10])
		.on("zoom", zoomed);

	var drag = d3.behavior.drag()
		.origin(function(d) {return d; })
		.on("dragstart", dragstarted)
		.on("drag", dragged)
		.on("dragend", dragended);

	var svg = d3.select(".graph")
		.append("svg")
		.attr("width", w)
		.attr("height", h)
		.append("g")
		.call(zoom);

	var rect = svg.append("rect")
    	.attr("width", w)
    	.attr("height", h)
    	.style("fill", "none")
    	.style("pointer-events", "all");

	var container = svg.append("g");


	var force = d3.layout.force()
		.nodes(dataset.nodes)
		.links(dataset.edges)
		.size([w, h])
		.linkDistance([400])
		.charge([-1000])
		.start();

	var edges = container.selectAll("line")
		.data(dataset.edges)
		.enter()
		.append("line")
		.style("stroke", "#ccc")
		.style("stroke-width", 1);

	var nodes = container.selectAll("rect")
		.data(dataset.nodes)
		.enter()
		.append("rect")
		.attr("width", 100)
		.attr("height", 100)
		.style("fill", function(d, i) {
			return colors(i);
		})
		.each(function(obj) {
			console.log(obj);
		})
		.call(force.drag);

	// force.on("tick", function() {

	// 	edges.attr("x1", function(d) { return d.source.x; })
	// 		.attr("y1", function(d) { return d.source.y; })
	// 		.attr("x2", function(d) { return d.target.x; })
	// 		.attr("y2", function(d) { return d.target.y; });

	// 	nodes.attr("x", function(d) { return d.x; })
	// 		.attr("y", function(d) { return d.y; });
	// });

	force.on("start", function() {
		edges.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });

		nodes.attr("x", function(d) { return d.x; })
			.attr("y", function(d) { return d.y; });
	})

	function zoomed() {
	  container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
	}

	function dragstarted(d) {
	  d3.event.sourceEvent.stopPropagation();
	  d3.select(this).classed("dragging", true);
	}

	function dragged(d) {
	  d3.select(this).attr("x", d.x = d3.event.x).attr("y", d.y = d3.event.y);

	}

	function dragended(d) {
	  d3.select(this).classed("dragging", false);
	}
}