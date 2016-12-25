/*
http://javascript.crockford.com/code.html
name: GridGenerator.js
purpose: generates grid for td_elements search inside a div element.
*/

/*      Includes    */
// $.getScript("bfs.cu.cc/js/Graph.js", function(){
// });

function Graph() {
  var neighbors = this.neighbors = {}; // Key = vertex, value = array of neighbors.

  this.addEdge = function (u, v) {
    if (neighbors[u] === undefined) {  // Add the edge u -> v.
      neighbors[u] = [];
    }
    neighbors[u].push(v);
    if (neighbors[v] === undefined) {  // Also add the edge v -> u in order
      neighbors[v] = [];               // to implement an undirected graph.
    }                                  // For a directed graph, delete
    neighbors[v].push(u);              // these four lines.
  };


  return this;
}

function GridGenerator(parentID,height,width) {
  this.parentID = parentID; // create a html table within the id of a placeholder
  this.height   = height; 
  this.width    = width;
  this.color    = "grey";
  this.start    = 0;        // start flag
  this.end      = 0;        // end flag
  this.startingPoint = null;
  this.endingPoint   = null
  this.found    = false;
  this.thread_num = 0;

this.addVerticesSleepTime  = 163;
this.shortestPathSleepTime = 333;

if(this.height > 50 && this.width > 50)
{
    this.addVerticesSleepTime = (this.height * this.width)/1000;
    this.shortestPathSleepTime = this.addVerticesSleepTime * 3;
}
this.graph = new Graph();

this.createGrid = function createAGrid() 
{
            
    if(this.height ==='' || this.width ==='')
    {
    alert("You must sumbit a height and a width to generate a grid.");
    //return false;
    }

    var table   = document.createElement("table");
    table.class = "jumbotron";
    var tr      = document.createElement("tr");
    var td      = document.createElement("td");
    td.setAttribute("id", "col_"+0);
    var element = document.getElementById(parentID);

    element.appendChild(table);

    var k = 1;
    for(i = 0; i < width; i++)
    {
        table.appendChild(tr);
        for(j = 0; j < height; j++)
        {
            /*td.style.width  = "2%";
            td.style.height = "2%";
            td.style.border = "1px solid black";*/
            tr.appendChild(td);
            td = document.createElement("td");
            td.setAttribute("id", "col_"+k);
            k++;
        }
        tr = document.createElement("tr");
    }        
}


this.clearGrid = function clearGridMarks()
{
        $('td').css({
            backgroundColor: ""
        });
}

this.setColor = function colorWall(color)
{
    this.color = color;
}

this.getColor = function getCurrentColor()
{
    return this.color;
}

this.setStart = function setStartingPoint()
{
    if(this.startingPoint != null)
    {
        //alert(this.startingPoint.css( "background-color" ));
        if(this.startingPoint.style.backgroundColor === "green")
            this.startingPoint.style.backgroundColor = "";
    }
    this.color = "green";
    this.start = 1;
}

this.setEnd   = function setEndingPoint()
{
    if(this.endingPoint != null)
    {
        //alert(this.startingPoint.css( "background-color" ));
        if(this.endingPoint.style.backgroundColor === "red")
            this.endingPoint.style.backgroundColor = "";
    }
    this.color = "red";
    this.end = 1;
}

this.removeStart = function removeStartingPointMode()
{
    this.color = "grey";
    this.start = 0;
}

this.removeEnd   = function removeEndingPointMode()
{
    this.color = "grey";
    this.end   = 0;
}

this.isStart = function isStartFlagOn()
{
    return this.start;
}

this.isEnd  = function isEndFlagOn()
{
    return this.end;
}

this.findOpenPaths = function findPath()
{
    var td_elements = document.getElementsByTagName("td");
    var endOfIndex = this.height * this.width;
    var startPoint = -1;
    i = 0;
    while(i < endOfIndex)
    {
        if(td_elements[i].style.backgroundColor === "green")
        {
            startPoint = i;
            this.startingPoint = td_elements[startPoint];
        }

        if(td_elements[i].style.backgroundColor === "red" )
        {
            endPoint = i;
            this.endingPoint = td_elements[endPoint];
        }
        i++;
    }

    this.findOpenPathHelper(td_elements, startPoint);
    this.found = false;
    this.thread_num = 0;
    return this;
}

this.sleep = function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}
this.findOpenPathHelper = async function pathFinder(td_elements, startPoint)
{
    this.thread_num++;
    console.log("THREAD: "+this.thread_num);
    if(this.found)
    {
        console.log("FOUND END!");
        return 0;
    }
    var checkTop    = true;
    var checkBottom = true;
    var checkLeft   = true;
    var checkRight  = true;
    var topColor    = "grey";
    var bottomColor = "grey";
    var leftColor   = "grey";
    var rightColor  = "grey";

    if( ( startPoint % this.width ) == 0)
        checkLeft = false;
    else
        leftColor = td_elements[startPoint - 1].style.backgroundColor;

    if( ( startPoint % ( this.width ) ) == ( this.width-1 ) ) 
        checkRight = false;
    else
        rightColor = td_elements[startPoint + 1].style.backgroundColor;


    if( startPoint < this.width )
        checkTop = false;
    else
        topColor = td_elements[startPoint - this.width].style.backgroundColor;

    if( startPoint >= ( this.width * ( this.height - 1 ) ) )
        checkBottom = false;
    else
        bottomColor = td_elements[startPoint + this.width].style.backgroundColor;

    if(topColor === "red" || bottomColor ==="red" || leftColor ==="red" || rightColor ==="red")
    {
        this.found = true;
        console.log("RED FOUND BABY!");
        return 0;
    }
    var sleepMS = this.addVerticesSleepTime;
    if(checkTop && topColor === "" )
    {
        console.log("path open above");
        td_elements[startPoint - this.width].style.backgroundColor = "lightblue";
        await this.sleep(sleepMS);
        this.findOpenPathHelper(td_elements,startPoint - this.width);

    }

    if(checkBottom && bottomColor === "" )
    {
        console.log("path open below");
        td_elements[startPoint + this.width].style.backgroundColor = "lightblue";
        await this.sleep(sleepMS);
        this.findOpenPathHelper(td_elements,startPoint + this.width);
    }

    if(checkLeft && leftColor === "" )
    {
        console.log("path open left");
        td_elements[startPoint - 1].style.backgroundColor = "lightblue";
        await this.sleep(sleepMS);
        this.findOpenPathHelper(td_elements,startPoint - 1);
    }

    if(checkRight && rightColor === "" )
    {
        console.log("path open right");
        td_elements[startPoint + 1].style.backgroundColor = "lightblue";
        await this.sleep(sleepMS);
        this.findOpenPathHelper(td_elements,startPoint + 1);
    }

    if(topColor === "grey" && bottomColor === "grey" && leftColor ==="grey" && rightColor === "grey" )
    {
        console.log("NO PATH AVAILABLE");
        return 0;
    }
}

this.insertAllVerticesAndEdges = function insertAllBlueTds()
{
    var td_elements = document.getElementsByTagName("td");
    var verticies_count = 0;
    for( i = 0; i < td_elements.length; i++)
    {
        switch(td_elements[i].style.backgroundColor)
        {
            case "lightblue":   verticies_count++;
                                this.insertVerticesAndEdgesHelper(td_elements,i);
                break;

            case "red":         verticies_count++;
                                this.insertVerticesAndEdgesHelper(td_elements,i);

                break;

            case "green":       verticies_count++;
                                this.insertVerticesAndEdgesHelper(td_elements,i);

                break;
        }
    }

    console.log("Number Of Verticies:" +verticies_count);
    this.bfs(this.startingPoint.getAttribute("id"));
    this.shortestPath(this.startingPoint.getAttribute("id"), this.endingPoint.getAttribute("id"));
}

this.insertVerticesAndEdgesHelper = function insertAllBlueTdsHelper(verticies, startPoint)
{
    var top         = startPoint - this.width;
    var bottom      = startPoint + this.width;
    var left        = startPoint - 1;
    var right       = startPoint + 1;
    var checkTop    = true;
    var checkBottom = true;
    var checkLeft   = true;
    var checkRight  = true;
    var topColor    = "grey";
    var bottomColor = "grey";
    var leftColor   = "grey";
    var rightColor  = "grey";

    if( ( startPoint % this.width ) == 0)
        checkLeft = false;
    else
        leftColor = verticies[left].style.backgroundColor;

    if( ( startPoint % ( this.width ) ) == ( this.width-1 ) ) 
        checkRight = false;
    else
        rightColor = verticies[right].style.backgroundColor;

    if( startPoint < this.width )
        checkTop = false;
    else
        topColor = verticies[top].style.backgroundColor;

    if( startPoint >= ( this.width * ( this.height - 1 ) ) )
        checkBottom = false;
    else
        bottomColor = verticies[bottom].style.backgroundColor;


    if( checkTop && topColor === "lightblue" ) 
    {
        this.graph.addEdge(verticies[startPoint].getAttribute("id"),verticies[top].getAttribute("id"));
    }

    if( checkBottom && bottomColor === "lightblue") 
    {
        this.graph.addEdge(verticies[startPoint].getAttribute("id"),verticies[bottom].getAttribute("id"));
    }

    if(checkLeft && leftColor === "lightblue"  ) 
    {
        this.graph.addEdge(verticies[startPoint].getAttribute("id"),verticies[left].getAttribute("id"));
    }

    if(checkRight && rightColor === "lightblue" ) 
    {
        this.graph.addEdge(verticies[startPoint].getAttribute("id"),verticies[right].getAttribute("id"));
    }
    




}

this.bfs = function (source) {

    var queue = [ { vertex: source, count: 0 } ],
    visited = { source: true },
    tail = 0;

    while (tail < queue.length) 
    {
        var u = queue[tail].vertex,
        count = queue[tail++].count;  // Pop a vertex off the queue.
        this.print('distance from ' + source + ' to ' + u + ': ' + count);
        
        this.graph.neighbors[u].forEach(function (v) {
            if (!visited[v]) {
                visited[v] = true;
                queue.push({ vertex: v, count: count + 1 });
            }
        });
    }
}

this.shortestPath = async function shortestPath(source, target) {
    if (source == target) {   // Delete these four lines if
        this.print(source);          // you want to look for a cycle
        return;                 // when the source is equal to
    }                         // the target.
    var queue = [ source ],
        visited = { source: true },
        predecessor = {},
        tail = 0;
    while (tail < queue.length) {
        var u = queue[tail++],  // Pop a vertex off the queue.
            neighbors = this.graph.neighbors[u];
        for (var i = 0; i < neighbors.length; ++i) {
        var v = neighbors[i];
        if (visited[v]) {
            continue;
        }
        visited[v] = true;
        if (v === target) {   // Check if the path is complete.
            var path = [ v ];   // If so, backtrack through the path.
            while (u !== source) {
            path.push(u);
            u = predecessor[u];
            }
            path.push(u);
            path.reverse();

            //for loop path[i]
            for(var i = 1; i < path.length-1; i++){
                console.log(path[i]+", ");
                await this.sleep(this.shortestPathSleepTime);
                document.getElementById(path[i]).style.backgroundColor = "yellow";
            }


            this.print(path.join(' &rarr; '));
            return;
        }
        predecessor[v] = u;
        queue.push(v);
        }
    }
    this.print('there is no path from ' + source + ' to ' + target);
}

this.print = function (s) {  // A quick and dirty way to display output.
    s = s || '';
    //document.getElementById('display').innerHTML += s + '<br>';
    console.log(s);
}

}
