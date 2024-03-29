// center the letter-containers in the tag-letters container
//function centerTagLetters() {
var realWidth = window.innerWidth;
var realHeight = window.innerHeight;

var m = [70, 240, 40, 0],
    w = realWidth - m[0] - m[0],
    h = realHeight - m[0] - m[2],
    i = 0,
    root;

var tree = d3.layout.tree()
    .sort(function comparator(a, b) {
      return +b.size - +a.size;
    })
    .size([w, h])

var diagonal = d3.svg.diagonal()
    .projection(function(d) {
      return [d.x, d.y];
    });

var vis = d3.select("#box").append("svg:svg")
    .attr("class", "svg_container")
    .attr("width", w)
    .attr("height", h)
    .style("overflow", "scroll")
    .style("background-color", " #F0F8FF")

    .append("svg:g")
    .attr("class", "drawarea")
    .append("svg:g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

var btnExpandCollapse = d3.select("#form #button");

function loadData(json) {
  root = json;
  root.x0 = h / 2;
  root.y0 = 0;

  init(root);


  btnExpandCollapse.on("click", function() {
    toggle(root);
    update(root);
  });

}

function update(source) {
  var duration = d3.event && d3.event.altKey ? 5000 : 500;

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse();
  //console.warn(nodes)

  // Normalize for fixed-depth.
  nodes.forEach(function(d) {
    d.y = d.depth * 125;
  });

  // Update the nodes…
  var node = vis.selectAll("g.node")
      .data(nodes, function(d) {
        return d.id || (d.id = ++i);
      });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("svg:g")
      .attr("class", "node")
      .on("click", function(d) {
        toggle(d);
        update(d);
      });

  nodeEnter.append("svg:circle")
      .attr("r", function(d) {
        return 25;
      })
      .attr("class", function(d) {
        return "level" + d.part_level;
      });

  nodeEnter.append("svg:text")
      .append("tspan")
      .text(function(d) {
        return d.name;
      })
      .attr("x", function(d) {
        return (this.getComputedTextLength() * -1)-15;
      })
      .attr("y", function(d) {
        return d.children || d._children ? -10 : -10;
      })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) {
        return d.children || d._children ? "start" : "start";
      })
      .attr("title", function(d) {
        var node_type_desc;
        if (d.part_level != 0) {
          node_type_desc = "Labour";
        } else {
          node_type_desc = "Component";
        }
        return d.name;
      })
      .style("fill-opacity", 1);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });

  nodeUpdate.select("circle")
      .attr("r", function(d) {
        return 10;
      })
      .attr("class", function(d) {
        return "level" + d.part_level;
      })
      .style("stroke", function(d) {
        if (d._children) {
          return "blue";
        }
      }).style("fill", function(d) {
    if (d._children) {
      return "blue";
    }
  });

  nodeUpdate.select("text")
      .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit();

  nodeExit.select("circle")
      .style("fill", function(d) {
        return "green";
      });


  // Update the links…
  var link = vis.selectAll("path.link")
      .data(tree.links(nodes), function(d) {
        return d.target.id;
      });

  // Enter any new links at the parent's previous position.
  link.enter().insert("svg:path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {
          x: source.x0,
          y: source.y0
        };
        return diagonal({
          source: o,
          target: o
        });
      })
      .transition()
      .duration(duration)
      .attr("d", diagonal);

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

function init(source) {
  var duration = d3.event && d3.event.altKey ? 5000 : 500;

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse();
  //console.warn(nodes)

  // Normalize for fixed-depth.
  nodes.forEach(function(d) {
    d.y = d.depth * 125;
  });

  // Update the nodes…
  var node = vis.selectAll("g.node")
      .data(nodes, function(d) {
        return d.id || (d.id = ++i);
      });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("svg:g")
      .attr("class", "node")
      .on("click", function(d) {
        toggle(d);
        update(d);
      });

  nodeEnter.append("svg:circle")
      .attr("r", function(d) {
        return 25;
      })
      .attr("class", function(d) {
        return "level" + d.part_level;
      });

  nodeEnter.append("svg:text")
      .append("tspan")
      .text(function(d) {
        return d.name;
      })
      .attr("x", function(d) {
        return (this.getComputedTextLength() * -1)-15;
      })
      .attr("y", function(d) {
        return d.children || d._children ? -10 : -10;
      })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) {
        return d.children || d._children ? "start" : "start";
      })
      .attr("title", function(d) {
        var node_type_desc;
        if (d.part_level != 0) {
          node_type_desc = "Labour";
        } else {
          node_type_desc = "Component";
        }
        return d.name;
      })
      .style("fill-opacity", 1);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });

  nodeUpdate.select("circle")
      .attr("r", function(d) {
        return 10;
      })
      .attr("class", function(d) {
        return "level" + d.part_level;
      })
      .style("stroke", function(d) {
        if (d._children) {
          return "blue";
        }
      }).style("fill", function(d) {
    if (d._children) {
      return "blue";
    }
  });

  nodeUpdate.select("text")
      .style("fill-opacity", 1);


  // Update the links…
  var link = vis.selectAll("path.link")
      .data(tree.links(nodes), function(d) {
        return d.target.id;
      });

  // Enter links at the parent's previous position.
  link.enter().insert("svg:path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {
          x: source.x0,
          y: source.y0
        };
        return diagonal({
          source: o,
          target: o
        });
      })
      .transition()
      .duration(duration)
      .attr("d", diagonal);
}

// Toggle children.
function toggle(d) {
  $(".node-metric").html("User Clicked Node > " + d.name);
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
}

loadData({"children":[{"children":[{"name":"Bicuspid Aortic Valve"}],"name":"Patienten"},{"name":"Probanden"}],"name":"Auswahl"});

