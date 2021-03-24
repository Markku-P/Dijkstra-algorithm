/** Dijkstra shortest path algorithm
 * Returns object array that contains all the distance costs and paths from point A to all other points
 * By Markku P 2021
 * 
 * @param {number} a Startpoint (distance matrix index number)
 * @param {number} b Endpoint (distance matrix index number)
 * @param {array} matrix Distance matrix (2D)
 * @param {boolean} showLog Boolean for showing console logs (default is false)
 * @returns {object array} Contains calculated lowest costs to all points from point A
 */

 function dijkstra(a, b, matrix, showLog = false) {
    if (showLog) {
        console.log(`| Finding the shortest path |\n - Startpoint: ${a}\n - Endpoint: ${b}`);
    }

    // Check that startpoint and endpoint are in distance matrix if not return null
    if ((a < 0) || (b < 0) || (a >= matrix.length) || (b >= matrix.length)) {
        if (showLog) {
            console.log(`Error, Check arguments`);
        }
        return null;
    }

    // Define variables
    let nodes = [[]];
    let currentNode = a;
    let nextNode = [null, Infinity];
    let distanceCosts = [];

    // Create object array based on the distance matrix
    for (let i = 0; i < matrix.length; i++) {
        distanceCosts[i] = {know: false, cost: Infinity, path: null, route: []};
    }

    // Set the start node know state to true and cost to zero
    distanceCosts[currentNode].know = true;
    distanceCosts[currentNode].cost = 0;
 
    // Find all the connected nodes and add their indexes and costs to array
    for (let i = 0; i < matrix.length; i++) {
        if (i != 0) nodes.push([]);
        for (let j = 0; j < matrix.length; j++) {
            if (matrix[i][j] != 0) {
                nodes[(nodes.length - 1)].push([j, matrix[i][j]]);
            }
        }
    }

    while (true) {
        // Go through all the nodes that are connected to current node
        nodes[currentNode].forEach(function(node, index) {
            if (!(distanceCosts[node[0]].know)) {
                if (distanceCosts[node[0]].cost > node[1] + distanceCosts[currentNode].cost) {
                    // Set the current lowest cost
                    distanceCosts[node[0]].cost = node[1] + distanceCosts[currentNode].cost; 
                    distanceCosts[node[0]].path = currentNode;
                }
                else if (nextNode[1] > (node[1] + distanceCosts[currentNode].cost)) {
                    // Change node to continue path
                    nextNode[0] = node[0];
                    nextNode[1] = (node[1] + distanceCosts[currentNode].cost);
                }
            }          
        });

        // If the all nodes that are connected to current node are visited. Then found new lowest cost node to be continue
        if (nextNode[0] == null) {
            for (let i = 0; i < distanceCosts.length; i++) {
                if (!(distanceCosts[i].know)) {
                    let tempNode = [null, Infinity];
                    
                    for (let i = 0; i < distanceCosts.length; i++) {
                        if ((!(distanceCosts[i].know)) && (distanceCosts[i].cost != Infinity) && (distanceCosts[i].cost < tempNode[1])) {
                            // Set the new found node index and cost
                            tempNode[0] = i;
                            tempNode[1] = distanceCosts[i].cost;
                        }
                    }
                    if (tempNode[0] != null) {
                        distanceCosts[tempNode[0]].know = true;
                        nextNode[0] = tempNode[0];
                        break;
                    }
                }
            }
            
            // If all nodes have been visited and no new nodes are found.
            if (nextNode[0] == null) {
                // Collect all the node paths to create route arrays
                for (let i = 0; i < distanceCosts.length; i++) {
                    let x = 0;

                    if (!(distanceCosts[i].path == null)) {
                        // Add the current node index number to route array
                        distanceCosts[i].route.push(i);
                        x = distanceCosts[i].path;

                        // Collect all paths and add them to route array
                        while (!(distanceCosts[x].path == null)) {
                            distanceCosts[i].route.push(x);
                            x = distanceCosts[x].path;
                        }
                        // Add the last node index number to route array and reverse array
                        distanceCosts[i].route.push(x);
                        distanceCosts[i].route.reverse();
                   } 
                }

                if (showLog) {
                    let costs = distanceCosts[b].cost;
                    let route = distanceCosts[b].route;
                    if (route.length != 0) {
                        console.log(`\nThe shortest path is through ${route} points and costs ${costs}`);
                    }
                    else {
                        console.log(`\nNo path was found between points ${a} and ${b}`);
                    }
                }
                
                // Return the completed distance costs and paths object array
                return distanceCosts;
            }
        }

        // Update current shortests path and cost to object array
        if (nextNode[1] < distanceCosts[nextNode[0]].cost) {
            distanceCosts[nextNode[0]].cost = nextNode[1];
            distanceCosts[nextNode[0]].path = currentNode;
        }

        // Change the current node and continue loop
        currentNode = nextNode[0];
        distanceCosts[currentNode].know = true;
        nextNode = [null, Infinity];
    }
}

// This allows the function to be used on nodejs or browser
try {
    module.exports = { dijkstra };
} catch (err) {}
