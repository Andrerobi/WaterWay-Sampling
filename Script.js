
// The svg
var svg = d3.select("svg"),
    originalWidth = 500,
    originalHeight = 500;

    var scaleFactor = 1.5;
    // Adjusted dimensions
    var width = originalWidth * scaleFactor,
        height = originalHeight * scaleFactor;

// Set new SVG dimensions
svg.attr("width", width)
    .attr("height", height);


// Markers = CIRCLES
var markers = [
  { x: 200, y: 150, group: "A", size: 34 }, // Example position
  { x: 500, y: 535, group: "Kannika", size: 25 }, //Kannika
  { x: 465, y: 370, group: "Chai", size: 15 }, //Chai
  { x: 555, y: 320, group: "Busarakhan", size: 10 }, //Busarakhan 
  { x: 555, y: 250, group: "Kohsoom", size: 10 }, //Kohsoom 
  { x: 400, y: 160, group: "Boonsri", size: 10 }, //Boonsri
  // Add more circle positions as needed
];

// Load external data and boot
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson", function(data){

    // Filter data
    data.features = data.features.filter( function(d){return d.properties.name=="WaterWay"} )

    // Create a color scale
    var color = d3.scaleOrdinal()
      .domain(["A", "Kannika", "Chai", "Busarakhan", "Kohsoom", "Boonsri" ])
      .range([ "#402D54", "#D18975", "#8FD175", "#FFEE8D", "#D175D1", "#D1A275"])

    // Add a scale for bubble size
    var size = d3.scaleLinear()
      .domain([1,100])  // What's in the data
      .range([ 4, 50])  // Size in pixel


      //Can probably delete this
    ///////////////////////////////////////
    // List of words with associated group
    // var words = [
    // { word: "Word1", group: "A" },
    // { word: "Word2", group: "A" },
    // { word: "Word3", group: "A" },
    // { word: "Word4", group: "A" },
    // { word: "Word5", group: "A" }
    // ];
    // // Create a div for the word list
    // var wordListDiv = d3.select("#wordList");

    // // Populate the word list
    // var wordItems = wordListDiv.selectAll(".wordItem")
    // .data(words)
    // .enter()
    // .append("div")
    // .classed("wordItem", true)
    // .html(function(d) {
    // return '<input type="radio" name="' + d.group + '" value="' + d.word + '">' + d.word;
    // })
    // .style("font-size", "14px");
    ///////////////////////////////////////////////
    
  
    // Add the background image from current directory
    svg.append("svg:image")
    .attr("xlink:href", "Waterways Final.jpg")
    .attr("width", width) //Scaling
    .attr("height", height) //Scaling
   


    // Add circles:
svg.selectAll("myCircles")
.data(markers)
.enter()
.append("circle")
.attr("class", function (d) { return d.group; })
.attr("cx", function (d) { return d.x; })  // Use x coordinate on the image
.attr("cy", function (d) { return d.y; })  // Use y coordinate on the image
.attr("r", function (d) { return size(d.size); })
.style("fill", function (d) { return color(d.group); })
.attr("stroke", function (d) { return color(d.group); })
.attr("stroke-width", 3)
.attr("fill-opacity", .4);


    // This function is gonna change the opacity and size of selected and unselected circles
    function update(){

      // For each check box:
      d3.selectAll(".checkbox").each(function(d){
        cb = d3.select(this);
        grp = cb.property("value")

        // If the box is check, I show the group
        if(cb.property("checked")){
          svg.selectAll("."+grp).transition().duration(1000).style("opacity", 1).attr("r", function(d){ return size(d.size) })

        // Otherwise I hide it
        }else{
          svg.selectAll("."+grp).transition().duration(1000).style("opacity", 0).attr("r", 0)
        }
      })
    }

    // When a button change, I run the update function
    d3.selectAll(".checkbox").on("change",update);

    // And I initialize it at the beginning
    update()
})