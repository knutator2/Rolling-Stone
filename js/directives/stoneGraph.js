
var d3 = require( 'd3' );
var $ = require( 'jquery' );
var _ = require( 'underscore' );

StoneConnection = {
    ORIGIN : 1,
    DESTINATION : 2,
    KIND : 3,
    PERIOD : 4
}

function StoneGraph(el, core, stones) {


    var self = this;
    self.stones = stones;
    self.available_stones = stones.slice();
    self.corestone = core;

    self.getStone = function(stone_id) {
        var index = _.findIndex(self.stones, {"inventory_id.": stone_id});
        return self.stones[index];
    }

    function get_stone_property_by_connection(connection_type) {
        var result = '';
        switch(connection_type) {
            case StoneConnection.ORIGIN: {
                result = 'origin';
                break;
            }

            case StoneConnection.DESTINATION: {
                result = 'coordinate';
                break;
            }

            case StoneConnection.KIND: {
                result = 'material';
                break;
            }

            case StoneConnection.PERIOD: {
                result = 'geological_era';
                break;
            }

        }
        return result;
    }

    //TODO: Normalize Stone Array
    function get_next_stone_id(stone_id, connection_type) {
        var propertyname = get_stone_property_by_connection(connection_type);
        var current_stone = self.getStone(stone_id);
        var propertyvalue = current_stone[propertyname]
        var candidates = _.filter(self.available_stones, function(obj) {
            return obj[propertyname] == propertyvalue;
        });
        if (candidates.length > 0) {
            var index = Math.floor((Math.random() * candidates.length));
            var new_stone = candidates[index];
            index = _.findIndex(self.stones, {"inventory_id.": new_stone["inventory_id."]});
            console.log('index: ' + index);
            self.available_stones.splice(index,2)
            return new_stone["inventory_id."];
        }

        // for (var i = 0; i < self.available_stones.length; i=i+2) {
        //     var candidate = self.available_stones[i];
        //     if (candidate[propertyname] == current_stone[propertyname]) {
        //         self.available_stones.splice(i,2);
        //         console.log("Current: " + stone_id + ", Next: " + candidate["inventory_id."]);
        //         return candidate["inventory_id."];
        //     }
        // }
        alert('next stone failed!!!');
    }

    // Add and remove elements on the graph object
    var addNode = this.addNode = function (stone_id) {
        console.log("stone to add");
        console.log(stone_id);
        nodes.push({"data":stone_id});
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

    this.addLink = function (sourceId, targetId, type) {
        var sourceNode = findNode(sourceId);
        var targetNode = findNode(targetId);

        if((sourceNode !== undefined) && (targetNode !== undefined)) {
            links.push({"source": sourceNode, "target": targetNode, "type":type});
            update();
        }
    }

    var findNode = function (id) {
        for (var i=0; i < nodes.length; i++) {
            if (nodes[i].data === id)
                return nodes[i]
        };
    }

    var findNodeIndex = function (id) {
        for (var i=0; i < nodes.length; i++) {
            if (nodes[i].data === id)
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

    var triangleOriginMouseOver = function(d) {
 		d3.select(this).select('.graph-icon')
 			.attr('xlink:href', 'img/assets/Graph_Herkunft_mouseover.svg');
 	}

	var triangleOriginMouseOut = function(d) {
 		d3.select(this).select('.graph-icon')
            .attr('xlink:href', 'img/assets/Graph_Herkunft.svg');
 	}

    var triangleDestinationMouseOver = function(d) {
        d3.select(this).select('.graph-icon')
            .attr('xlink:href', 'img/assets/Graph_Fundort_mouseover.svg');
    }

    var triangleDestinationMouseOut = function(d) {
        d3.select(this).select('.graph-icon')
            .attr('xlink:href', 'img/assets/Graph_Fundort.svg');
    }

    var trianglePeriodMouseOver = function(d) {
        d3.select(this).select('.graph-icon')
            .attr('xlink:href', 'img/assets/Graph_Erdzeitalter_mouseover.svg');
    }

    var trianglePeriodMouseOut = function(d) {
        d3.select(this).select('.graph-icon')
            .attr('xlink:href', 'img/assets/Graph_Erdzeitalter.svg');
    }

    var triangleKindMouseOver = function(d) {
        d3.select(this).select('.graph-icon')
            .attr('xlink:href', 'img/assets/Graph_Gesteinsart_mouseover.svg');
    }

    var triangleKindMouseOut = function(d) {
        d3.select(this).select('.graph-icon')
            .attr('xlink:href', 'img/assets/Graph_Gesteinsart.svg');
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

 	var expand = function(d, type) {
        var next_stone_id = get_next_stone_id(d.data, type)
 		addNode(next_stone_id);
        console.log("add link between" + d.data + " and " + next_stone_id);
        self.addLink(d.data, next_stone_id, type);
 	}

    var expand_by_origin = function(d) {
        expand(d, StoneConnection.ORIGIN);
    }

    var expand_by_destination = function(d) {
        expand(d, StoneConnection.DESTINATION);
    }

    var expand_by_kind = function(d) {
        expand(d, StoneConnection.KIND);
    }

    var expand_by_period = function(d) {
        expand(d, StoneConnection.PERIOD);
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
            .data(links, function(d) { return d.source.data + "-" + d.target.data; });

        var linkEnter = link.enter();//.append("g");

        linkEnter.insert("line")
            .attr("class", "link");

     	// linkEnter.append('text')
     	// 	.text('mytext');

        link.exit().remove();

        var node = container.selectAll("g.node")
            .data(nodes, function(d) { return d.data; });

        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .call(force.drag);

        nodeEnter.append("image")
            .attr("xlink:href", function(d) {
                console.log("image:" + d.data);
                var stone = self.getStone(d.data)
                console.log(stone)
                return "img/medium/" + stone.img;
            })
            .attr("x", "0px")
            .attr("y", "0px")
            .attr("width", "100px")
            .attr("height", "100px");

		// 	//triangle up
        var triangleUp = nodeEnter.append('g')
            .on("click", expand_by_origin)
            .on("mouseover", triangleOriginMouseOver)
            .on("mouseout", triangleOriginMouseOut);

 		triangleUp.append("polygon")
	 	 		.style("stroke", "black")
	 	 		.style("fill", "none")
	 	 		.attr("points", function(d) {
	 	 	 		return "0,0, 50,-50, 100,0";
	 	 		})
	 	 	.style("pointer-events", "all");


        triangleUp.append('image')
            .attr('xlink:href', "img/assets/Graph_Herkunft.svg")
            .attr('x', '35px')
            .attr('y', '-35px')
            .attr('width', '30px')
            .attr('height', '30px')
            .attr('class', 'graph-icon' )

	 	// 	//triangle left
        var triangleLeft = nodeEnter.append('g')
            .on("click", expand_by_destination)
            .on("mouseover", triangleDestinationMouseOver)
            .on("mouseout", triangleDestinationMouseOut);

 		triangleLeft.append("polygon")
	 	 		.style("stroke", "black")
	 	 		.style("fill", "none")
	 	 		.attr("points", function(d) {
	 	 	 		return "0,0, -50,50, 0,100";
	 	 		})
	 	 	.style("pointer-events", "all")


        triangleLeft.append('image')
            .attr('xlink:href', "img/assets/Graph_Fundort.svg")
            .attr('x', '-35px')
            .attr('y', '35px')
            .attr('width', '30px')
            .attr('height', '30px')
            .attr('class', 'graph-icon' )

	 	// 	//triangle down
        var triangleDown = nodeEnter.append('g')
            .on("click", expand_by_period)
            .on("mouseover", trianglePeriodMouseOver)
            .on("mouseout", trianglePeriodMouseOut);

 		triangleDown.append("polygon")
	 	 		.style("stroke", "black")
	 	 		.style("fill", "none")
	 	 		.attr("points", function(d) {
	 	 	 		return "0,100, 50,150, 100,100";
	 	 		})
	 	 	.style("pointer-events", "all");

        triangleDown.append('image')
            .attr('xlink:href', "img/assets/Graph_Erdzeitalter.svg")
            .attr('x', '35px')
            .attr('y', '105px')
            .attr('width', '30px')
            .attr('height', '30px')
            .attr('class', 'graph-icon' )

	 	// 	//triangle right
        var triangleRight = nodeEnter.append('g')
            .on("click", expand_by_kind)
            .on("mouseover", triangleKindMouseOver)
            .on("mouseout", triangleKindMouseOut);

 		triangleRight.append("polygon")
	 	 		.style("stroke", "black")
	 	 		.style("fill", "none")
	 	 		.attr("points", function(d) {
	 	 	 		return "100,0, 150,50, 100,100";
	 	 		})
	 	 	.style("pointer-events", "all");

        triangleRight.append('image')
            .attr('xlink:href', "img/assets/Graph_Gesteinsart.svg")
            .attr('x', '105px')
            .attr('y', '35px')
            .attr('width', '30px')
            .attr('height', '30px')
            .attr('class', 'graph-icon' )

    	//node.exit().remove();

        force.on("tick", function() {
            link.attr("x1", function(d) { console.log(d); return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; })
                .attr('transform', function(d) {
                    var x = 0;
                    var y = 0;
                    switch(d.type) {
                        case StoneConnection.ORIGIN:
                            x+=50;
                            break;
                        case StoneConnection.DESTINATION:
                            y+=50;
                            break;
                        case StoneConnection.PERIOD:
                            y+=100;
                            x+=50;
                            break;
                        case StoneConnection.KIND:
                            x+=100;
                            y+=50;
                            break;
                    }
                    return 'translate(' + x + ',' + y + ')';
                });

            node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        });

        // Restart the force layout.
        force.start();
    }

    // Make it all go
    update();
}


//myApp.directive('stonegraph', function() {
var stoneGraph = function() {
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
				graph.addNode(scope.active["inventory_id."]);
				// setupGraph();
				// initGraph(scope.active, scope.stones);
			}
		}
	};
}

module.exports = stoneGraph;
