# d3-challenge
## Monash Data Course Wk 16

### The D3 Times

For this assignment we were tasked with using D3 to create an interactive visualisation with a given set of data relating to health factors across US states.

The first step was to create an SVG canvas, defining a height and a width, and a margin for our chart to fit within. The svg element was then appended to the index.html file, attributing the defined height and width. A group element was then appended to the svg element, using the left and top margin definitions to translate the location of the chart.

We then initialise the x and y axes to contain one of our variables.

We then creaete various functions, listed below 
- X & Y scale functions - defining the domain based on the chosen x/y variable that gets selected. Returns a linear scale variable
- X & Y Axes rendering functions - using the returned linear scale from above, the axes will be redefined using the axisLeft/axisBottom functions from the d3 library, and applies a transition effect.
- X & Y render circles function - moves the circles to match their corresponding locations for the new chosen axis information.
- X & Y render text function - Ensures that the corresponding State Abbreviation to circle translates to the new location when a new axis is selected.
- Update tool tip function - ensures that the tool tip that is attached to a data point reflects the correct data according to the selected x and y axes.

The provided csv is read using the d3.csv() function and each dataset (i.e. column in the csv) is attributed to a different variable to prep for calling given the selection.

The initial scales, axes, points and text are created using our chosenX/YAxis variables, and the x/yLabelGroups are defined to hold the information.

We create event listeners for both the X and Y axes, and define that .on("click") we updated the chosenX/YAxis to become the clicked value. The listener then calls all of the created functions to have the visualisation reflect the new data.

All of the above is wrapped in a responsive function, that redefines the size of the SVG canvas, making it dependant on the size of the window.

The resulting visualisation has been deployed here - https://jt-lowe.github.io/d3-challenge/
