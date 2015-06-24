var dataset = {
        nodes: [
                { name: "Adam" },
                { name: "Bob" },
                { name: "Carrie" },
        ],
        edges: [
                { source: 0, target: 1 },
                { source: 0, target: 2 },
		]
	};

var force = {};

function StoneGraph(el, core, stones) {

	
    // Add and remove elements on the graph object
    var addNode = this.addNode = function (id) {
        nodes.push({"id":id});
        update();
    }

    this.removeNode = function (id) {
        var i = 0;
        var n = findNode(id);
        while (i < links.length) {
            if ((links[i]['source'] === n)||(links[i]['target'] == n)) links.splice(i,1);
            else i++;
        }
        var index = findNodeIndex(id);
        if(index !== undefined) {
            nodes.splice(index, 1);
            update();
        }
    }

    this.addLink = function (sourceId, targetId) {
        var sourceNode = findNode(sourceId);
        var targetNode = findNode(targetId);

        if((sourceNode !== undefined) && (targetNode !== undefined)) {
            links.push({"source": sourceNode, "target": targetNode});
            update();
        }
    }

    var findNode = function (id) {
        for (var i=0; i < nodes.length; i++) {
            if (nodes[i].id === id)
                return nodes[i]
        };
    }

    var findNodeIndex = function (id) {
        for (var i=0; i < nodes.length; i++) {
            if (nodes[i].id === id)
                return i
        };
    }

    var element = d3.select(el)[0];
	var first = core;
	var collection = stones;

    // set up the D3 visualisation in the specified element
    var w = $(el).innerWidth(),
        h = $(el).innerHeight();

    var vis = this.vis = d3.select(el).append("svg:svg")
        .attr("width", w)
        .attr("height", h);

    var triangleMouseDown = function(d) {
 		d3.select(this)
 			.style('fill', 'black');
 	}

	var triangleMouseUp = function(d) {
 		d3.select(this)
 			.style('fill', 'none');
 	}

    var createExpansionButton = function(element, figure) {
		d3.select(element)
			.append("polygon")
	 	 		.style("stroke", "black")
	 	 		.style("fill", "none")
	 	 		.attr("points", function(d) {  
	 	 	 		return figure; 
	 	 		})
	 	 	.style("pointer-events", "all")
	 	 	.on("click", expand)
	 	 	.on("mousedown", triangleMouseDown)
	 	 	.on("mouseup", triangleMouseUp);
	}

    var zoomed = function() {
 		d3.selectAll(".background-container")
 	  		.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
 	}

    var zoom = d3.behavior.zoom()
 		.scaleExtent([1, 10])
 		.on("zoom", zoomed);

    var rect = vis.append("rect")
     	.attr("width", w)
     	.attr("height", h)
     	.style("fill", "none")
     	.style("pointer-events", "all")
     	.call(zoom);

    // container layer for nodes and edges
 	var container = vis
 		.append("g")
 		.attr('width', w)
 		.attr('height', h)
 		.classed('background-container', true);

    

 	var dragstarted =  function(d) {
 	 	d3.event.sourceEvent.stopPropagation();
		d3.select(this).classed("dragging", true);
 	}

 	var dragged = function(d) {
 		d3.select(this).attr("x", d.x = d3.event.x).attr("y", d.y = d3.event.y);
 	}

 	var dragended = function(d) {
 		d3.select(this).classed("dragging", false);
 	}

 	var expand = function(d) {
 		addNode(Math.floor((1 + Math.random()) * 0x10000).toString(16))
 	}

 	var drag = d3.behavior.drag()
 		.origin(function(d) {return d; })
 		.on("dragstart", dragstarted)
 		.on("drag", dragged)
 		.on("dragend", dragended);	    

    var force = d3.layout.force()
        .gravity(.05)
        .distance(400)
        .charge(-1000)
        .size([w, h]);

    var nodes = force.nodes(),
        links = force.links();

    var colors = d3.scale.category10();
    
    var update = function () {

        var link = container.selectAll("line.link")
            .data(links, function(d) { return d.source.id + "-" + d.target.id; });

        link.enter().insert("line")
            .attr("class", "link");

        link.exit().remove();

        var node = container.selectAll("g.node")
            .data(nodes, function(d) { return d.id;});

        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .call(force.drag);

        nodeEnter.append("image")
            .attr("xlink:href", "img/StadtmuseumBerlin_GeologischeSammlung_G-99-13_MichaelSetzpfandt.jpg")
            .attr("x", "0px")
            .attr("y", "0px")
            .attr("width", "100px")
            .attr("height", "100px");

        // nodeEnter.append("text")
        //     .attr("class", "nodetext")
        //     .attr("dx", 12)
        //     .attr("dy", ".35em")
        //     .text(function(d) {return d.id});

		// nodeEnter.append("rect")
		//  		.attr("width", 100)
		//  		.attr("height", 100)
		//  		.style("fill", function(d, i) {
		//  			return colors(i);
		//  		});

		// 	//triangle up
 		nodeEnter.append("polygon")
	 	 		.style("stroke", "black")
	 	 		.style("fill", "none")
	 	 		.attr("points", function(d) {  
	 	 	 		return "0,0, 50,-50, 100,0"; 
	 	 		})
	 	 	.style("pointer-events", "all")
	 	 	.on("click", expand)
	 	 	.on("mousedown", triangleMouseDown)
	 	 	.on("mouseup", triangleMouseUp);

	 	// 	//triangle left
 		nodeEnter.append("polygon")
	 	 		.style("stroke", "black")
	 	 		.style("fill", "none")
	 	 		.attr("points", function(d) {  
	 	 	 		return "0,0, -50,50, 0,100"; 
	 	 		})
	 	 	.style("pointer-events", "all")
	 	 	.on("click", expand)
	 	 	.on("mousedown", triangleMouseDown)
	 	 	.on("mouseup", triangleMouseUp);

	 	// 	//triangle down
 		nodeEnter.append("polygon")
	 	 		.style("stroke", "black")
	 	 		.style("fill", "none")
	 	 		.attr("points", function(d) {  
	 	 	 		return "0,100, 50,150, 100,100"; 
	 	 		})
	 	 	.style("pointer-events", "all")
	 	 	.on("click", expand)
	 	 	.on("mousedown", triangleMouseDown)
	 	 	.on("mouseup", triangleMouseUp);

	 	// 	//triangle right
 		nodeEnter.append("polygon")
	 	 		.style("stroke", "black")
	 	 		.style("fill", "none")
	 	 		.attr("points", function(d) {  
	 	 	 		return "100,0, 150,50, 100,100"; 
	 	 		})
	 	 	.style("pointer-events", "all")
	 	 	.on("click", expand)
	 	 	.on("mousedown", triangleMouseDown)
	 	 	.on("mouseup", triangleMouseUp);

    	node.exit().remove();

        force.on("tick", function() {
          link.attr("x1", function(d) { return d.source.x; })
              .attr("y1", function(d) { return d.source.y; })
              .attr("x2", function(d) { return d.target.x; })
              .attr("y2", function(d) { return d.target.y; });

          node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        });

        // Restart the force layout.
        force.start();
    }

    // Make it all go
    update();
}


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
			scope.init = function() {
				graph = new StoneGraph('#graph', scope.active, scope.stones);
				graph.addNode("Cause");
				graph.addNode("Effect");
				graph.addLink("Cause", "Effect");
				graph.addNode("A");
				graph.addNode("B");
				graph.addLink("A", "B");

				// setupGraph();
				// initGraph(scope.active, scope.stones);
			}
		}
	};
});