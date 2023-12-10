
// The svg
var svg = d3.select("svg"),
    originalWidth = 500,
    originalHeight = 500;

// Color scale
var color = d3.scaleOrdinal()
    .domain(["Decha", "Kannika", "Chai", "Busarakhan", "Kohsoom", "Boonsri", "Achara", "Somchair", "Tansanee", "Sakda"])
    .range(["#402D54", "#D18975", "#8FD175", "#FFEE8D", "#D175D1", "#D1A275", "#D1D175", "#D1758F", "#75D1D1", "#D1758F"]);


// Markers = CIRCLES
//These are placement sensitive
var markers = [ 
{ x: 250, y: 510, group: "Tansanee", size: 1 }, // Tansanee
{ x: 250, y: 350, group: "Somchair", size: 1 }, //Somchair 
{ x: 400, y: 640, group: "Sakda", size: 1 }, //Sakda
{ x: 555, y: 250, group: "Kohsoom", size: 1 }, //Kohsoom 
{ x: 500, y: 535, group: "Kannika", size: 1 }, //Kannika
{ x: 110, y: 440, group: "Decha", size: 1 }, // Decha
{ x: 465, y: 370, group: "Chai", size: 1 }, //Chai
{ x: 555, y: 320, group: "Busarakhan", size: 1 }, //Busarakhan 
{ x: 400, y: 160, group: "Boonsri", size: 1 }, //Boonsri
{ x: 320, y: 260, group: "Achara", size: 1 }, //Achara 
];



// Adjusted dimensions to show the map
var scaleFactor = 1.5;
var width = originalWidth * scaleFactor,
    height = originalHeight * scaleFactor;

// Set new SVG dimensions
svg.attr("width", width)
    .attr("height", height);

// Determines the circle size
var sizeDomain = d3.extent(markers, function(d) { return d.size; });

// Add a scale for bubble size
var sizeScale = d3.scaleLinear()
    .domain(sizeDomain)  // Adjust based on your data
    .range([4, 50]);  // Size in pixels, adjust the range based on your desired size range


console.log(parsedData);

//testing
var chaiData = parsedData.filter(function(d) {
  return d.location === "Chai";
});
console.log("Data for locations named 'Chai':", chaiData);

var uniqueYears = [...new Set(parsedData.map(d => d.year_of_sample_date))];
var uniqueMonths = [...new Set(parsedData.map(d => d.month_of_sample_date))];

var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Create radio buttons for years
createRadioButtons(uniqueYears);

// Create a slider for months
createMonthSlider(uniqueMonths);

// Function to create radio buttons
function createRadioButtons(years) {
  var radioContainer = d3.select("#radio-container");

  radioContainer.selectAll("input")
    .data(years)
    .enter()
    .append("label")
    .text(function(d) { return d; })
    .append("input")
    .attr("type", "radio")
    .attr("name", "year")
    .attr("value", function(d) { return d; })
    .property("checked", function(d, i) { return i === 0; }) // Default to the first year
    .on("change", function() {
      // Handle year change event
      var selectedYear = this.value;
      var dataForSelectedYear = parsedData.filter(function(d) {
        return d.year_of_sample_date === +selectedYear;
      });

      // Log all data points for the selected year to the console
      console.log("Data for year " + selectedYear + ":", dataForSelectedYear);

      updateVisualization(dataForSelectedYear);
    });
}


// Function to create a slider
function createMonthSlider(months) {
  var sliderContainer = d3.select("#slider-container");

  sliderContainer.select("#month-slider")
      .on("input", function() {
          // Handle month slider input event
          var selectedMonthNumber = +this.value;
          var selectedMonthName = monthNames[selectedMonthNumber - 1];

          // Update the displayed month 
          sliderContainer.select("#selected-month").text(selectedMonthName);

          // Continue with the updateVisualization function or any other actions
          updateVisualization(parsedData);
      });
}



 // Function to update visualization based on selected year and month
function updateVisualization(selectedYear, selectedMonth) {
  console.log("Selected Year:", selectedYear);
  console.log("Selected Month (Number):", selectedMonth);

  // Convert numeric month to string representation
  var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var selectedMonthName = monthNames[selectedMonth - 1];
  //console.log("Selected Month (String):", selectedMonthName);

   // Filter data based on selected year and month
   var filteredData = parsedData.filter(function (d) {
    return d.year_of_sample_date === selectedYear && d.month_of_sample_date === selectedMonthName //&&
        //d.x !== null && d.y !== null && d.value !== null;  // Add additional conditions as needed
});



   console.log("Filtered Data:", filteredData);
  //console.log("Filtered Data By Location:", filteredDataByLocation);


 // Update circle sizes based on the 'measure value' for the selected data subset
 sizeScale.domain([0, d3.max(filteredData, function (d) { return d.value; })]);

 

//HAVING TROUBLE WITH THIS PART ~~~~~~
// Add or update circles
var circles = svg.selectAll("circle")
    .data(filteredData, function(d, i) { 
      return i !== null && i !== undefined ? i : d.group
    });
    

    circles.enter()
    .append("circle")
    .attr("cx", function (d) { return d.x; })
    .attr("cy", function (d) { return d.y; })
    .merge(circles)
    .transition()
    .duration(1000)
    .attr("r", function (d) { 
      console.log("Circle Size:", d.location ,sizeScale(d.value));
      return sizeScale(d.value); 
    })  // Use sizeScale for the bubble size
    .style("fill", function (d) { return color(d.group); });

    

circles.exit().remove();

}


// Assuming you have a function to initialize the visualization
function initializeVisualization() {
  // Your initialization code here
}

createMonthSlider([...new Set(parsedData.map(d => d.month_of_sample_date))]);

// Event listener for radio buttons
d3.selectAll("input[name='year']").on("change", function () {
  var selectedYear = +this.value; // Convert to number
  var selectedMonth = +d3.select("#month-slider").property("value"); // Get selected month from the slider

  updateVisualization(selectedYear, selectedMonth);
});

// Event listener for the initial setup
d3.select("#month-slider").on("input", function () {
  var selectedYear = +d3.select("input[name='year']:checked").node().value; // Get selected year from radio buttons
  var selectedMonth = +this.value; // Get selected month from the slider

  updateVisualization(selectedYear, selectedMonth);
});

// Initialize the visualization
initializeVisualization();

// Load external data and boot
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson", function(data){

    // Filter data
    data.features = data.features.filter( function(d){return d.properties.name=="WaterWay"} )

    

    // // Create a color scale
    // var color = d3.scaleOrdinal()
    //   .domain(["Decha", "Kannika", "Chai", "Busarakhan", "Kohsoom", "Boonsri", "Achara", "Somchair", "Tansanee", "Sakda" ])
    //   .range([ "#402D54", "#D18975", "#8FD175", "#FFEE8D", "#D175D1", "#D1A275", "#D1D175", "#D1758F", "#75D1D1", "#D1758F"])

    // Add a scale for bubble size
    var size = d3.scaleLinear()
      .domain([1,100])  // What's in the data
      .range([ 4, 50])  // Size in pixel
    
  
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
    .attr("cx", function (d) {
        console.log("X Coordinate:", d.x);
        return d.x;
    })
    .attr("cy", function (d) {
        console.log("Y Coordinate:", d.y);
        return d.y;
    })
    .attr("r", function (d) {
        console.log("Circle Size:", sizeScale(d.size));
        return sizeScale(d.size);
    })
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