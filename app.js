// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");
  
    // clear svg is not empty
    if (!svgArea.empty()) {
      svgArea.remove();
    }


    // SVG wrapper dimensions are determined by the current width and
    // height of the browser window.
    var svgWidth = window.innerWidth/1.4;
    var svgHeight = window.innerHeight/1.3;


    var margin = {
      top: 50,
      bottom: 150, // updated from 50 to reflect the area required for the 3 selection options
      right: 50,
      left: 150 // updated from 50 to reflect the area required for the 3 selection options
    };
  
    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;
  
    // Append SVG element
    var svg = d3
      .select("#scatter")
      .append("svg")
      .attr("height", svgHeight)
      .attr("width", svgWidth);
  
    // Append group element
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);


    //Initialise axes parameters
    var chosenXAxis = "poverty";
    var chosenYAxis = "healthcare";
  
    // function used for updating x-scale var upon click on axis label
    function xScale(paperData, chosenXAxis) {
      // create scales
      var xLinearScale = d3.scaleLinear()
        .domain([d3.min(paperData, d => d[chosenXAxis])*.7,d3.max(paperData, d => d[chosenXAxis])*1.1])
        .range([0, width]);

      return xLinearScale;

    }

    // function used for updating y-scale var upon click on axis label
    function yScale(paperData, chosenYAxis) {
      // create scales
      var yLinearScale = d3.scaleLinear()
        .domain([d3.min(paperData, d => d[chosenYAxis])-2,d3.max(paperData, d => d[chosenYAxis])+2])
        .range([height,0]);

      return yLinearScale;

    }

    // function used for updating xAxis var upon click on axis label
    function renderXAxes(newXScale, xAxis) {
      var bottomAxis = d3.axisBottom(newXScale);

      xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

      return xAxis;
    }

    // function used for updating yAxis var upon click on axis label
    function renderYAxes(newYScale, yAxis) {
      var leftAxis = d3.axisLeft(newYScale);

      yAxis.transition()
        .duration(1000)
        .call(leftAxis);

      return yAxis;
    }


    // function used for updating circles group with a transition to new circles
    function renderXCircles(circles, newXScale, chosenXAxis) {

      circles.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))

      return circles;
    }

    function renderYCircles(circles, newYScale, chosenYAxis) {

      circles.transition()
        .duration(1000)
        .attr("cy", d => newYScale(d[chosenYAxis]))

      return circles;
    }

    //function to update the text within the circles
    function renderXText(dataGroup, newXScale, chosenXAxis) {

      dataGroup.transition()
        .duration(1000)
        .attr("dx", d => newXScale(d[chosenXAxis]))

      return dataGroup;
    }

    function renderYText(dataGroup, newYScale, chosenYAxis) {

      dataGroup.transition()
        .duration(1000)
        .attr("dy", d => newYScale(d[chosenYAxis])+5)

      return dataGroup;
    }

    // function used for updating circles group with new tooltip
    function updateToolTip(chosenXAxis, chosenYAxis, dataGroup) {

      var xLabel;

      if (chosenXAxis === "age") {
        xLabel = "Median Age: ";
      }
      else if (chosenXAxis === "poverty"){
        xLabel = "Poverty %: ";
      }
      else {
        xLabel = "Median Income: $";
      }

      var yLabel;

      if (chosenYAxis === "healthcare") {
        yLabel = "Lacks Healthcare %: ";
      }
      else if (chosenYAxis === "obese"){
        yLabel = "Obesity %: ";
      }
      else {
        yLabel = "Smokers %: ";
      }

      var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>${xLabel}${d[chosenXAxis]}<br>${yLabel}${d[chosenYAxis]}`);
      });

    dataGroup.call(toolTip);
  
    dataGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return dataGroup;
  }


    // Read CSV
    d3.csv("data.csv").then((paperData, err) => {

      if (err) throw err;

      //parse data as numbers
      paperData.forEach(data => {
          data.poverty = +data.poverty;
          data.age = +data.age;
          data.income = +data.income;
          data.healthcare = +data.healthcare;
          data.obesity = +data.obesity;
          data.smokes = +data.smokes;
        });

      // create scales
      var xLinearScale = xScale(paperData,chosenXAxis)
      var yLinearScale = yScale(paperData,chosenYAxis)

      //create initial axes
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);
        
      //append axes
      var xAxis = chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
  
      var yAxis = chartGroup.append("g")
        .call(leftAxis);
        
      //append scatter points
      var dataGroup = chartGroup.selectAll("circle")
        .data(paperData)
        .enter()
        .append("g")


      var circles = dataGroup.append("circle")
        .classed("stateCircle",true)
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 15)

      //add text to scatter points
      var circlesText = dataGroup.append("text")
      .text(d => d.abbr)
      .attr("dx", d => xLinearScale(d[chosenXAxis]))
      .attr("dy", d => yLinearScale(d[chosenYAxis])+5) //to center the text in the circles
      .classed('stateText', true);


    // Create group for three x-axis labels
    var xLabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
    var povertyLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("In Poverty (%)");
  
    var ageLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age (Median)");

    var incomeLabel = xLabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .text("Household Income (Median)");
    
    // Create group for three y-axis labels
    var yLabelsGroup = chartGroup.append("g")
      .attr("transform", "rotate(-90)")
    
    var obeseLabel = yLabelsGroup.append("text")
      .attr("y", -80)
      .attr("x", -(height/2))
      .attr("dy", "1em")
      .attr("value", "obesity") // value to grab for event listener
      .classed("inactive", true)
      .text("Obese (%)");
  
    var smokeLabel = yLabelsGroup.append("text")
      .attr("y", -60)
      .attr("x", -(height/2))
      .attr("dy", "1em")
      .attr("value", "smokes") // value to grab for event listener
      .classed("inactive", true)
      .text("Smokes (%)");

    var healthLabel = yLabelsGroup.append("text")
      .attr("y", -40)
      .attr("x", -(height/2))
      .attr("dy", "1em")
      .attr("value", "healthcare") // value to grab for event listener
      .classed("active", true)
      .text("Lacks Healthcare (%)");


      // updateToolTip function above csv import
      var dataGroup = updateToolTip(chosenXAxis, chosenYAxis, dataGroup);
      
      // x axis labels event listener
      xLabelsGroup.selectAll("text")
      .on("click", function() {
        //get value of selection
        var value = d3.select(this).attr("value");
        if (value!==chosenXAxis){
          chosenXAxis = value;

          //Update x scale
          xLinearScale = xScale(paperData,chosenXAxis);

          //Update x axis
          xAxis = renderXAxes(xLinearScale,xAxis);

          //Update scatter points 
          circles = renderXCircles(circles, xLinearScale, chosenXAxis);

          //updating text within circles
          circlesText = renderXText(circlesText, xLinearScale, chosenXAxis)  

          //Update tooltips with new info
          dataGroup = updateToolTip(chosenXAxis, chosenYAxis, dataGroup);

          //Make the selected x-axis bold
          if (chosenXAxis === "age") {
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenXAxis === "poverty"){
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            povertyLabel
              .classed("active", true)
              .classed("inactive", false);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenXAxis === "income"){
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }

      });
    
      // y axis labels event listener
      yLabelsGroup.selectAll("text")
      .on("click", function() {
        var value = d3.select(this).attr("value");
        if (value!==chosenYAxis){
          chosenYAxis = value;

          //Update y scale
          yLinearScale = yScale(paperData,chosenYAxis);

          //Update y axis
          yAxis = renderYAxes(yLinearScale,yAxis);

          //Update scatter points 
          circles = renderYCircles(circles, yLinearScale, chosenYAxis);

          //updating teyt within circles
          circlesText = renderYText(circlesText, yLinearScale, chosenYAxis)  

          //Update tooltips with new info
          dataGroup = updateToolTip(chosenXAxis, chosenYAxis, dataGroup);

          //Make the selected y-axis bold
          if (chosenYAxis === "healthcare") {
            healthLabel
              .classed("active", true)
              .classed("inactive", false);
            smokeLabel
              .classed("active", false)
              .classed("inactive", true);
            obeseLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenYAxis === "smokes"){
            healthLabel
              .classed("active", false)
              .classed("inactive", true);
            smokeLabel
              .classed("active", true)
              .classed("inactive", false);
            obeseLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenYAxis === "obesity"){
            healthLabel
              .classed("active", false)
              .classed("inactive", true);
            smokeLabel
              .classed("active", false)
              .classed("inactive", true);
            obeseLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }

      });
    });
};


  

  
  // When the browser loads, makeResponsive() is called.
  makeResponsive();
  
  // When the browser window is resized, makeResponsive() is called.
  d3.select(window).on("resize", makeResponsive);
  