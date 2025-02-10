function generateTree() {
    document.getElementById("graph").innerHTML = "";
    const input = document.getElementById("vector").value;
    const vector = input.split(",").map(item => item.trim() === "null" ? null : parseInt(item.trim()));
    const dot = vectorToDot(vector);
    var viz = new Viz();
    viz.renderSVGElement(dot).then(function (element) {
        element.querySelectorAll(".node text").forEach(node => node.setAttribute("fill", "white"));
        element.querySelectorAll(".edge path").forEach(edge => edge.setAttribute("stroke", "white"));
        document.getElementById("graph").appendChild(element);
    }).catch(error => { console.error(error); });
}

function vectorToDot(vector) {
    if (vector.length === 0) {
        return `
        digraph G { 
            graph [bgcolor=transparent]; 
            node [color=white, fontcolor=white]; 
            edge [color=white]; 
        }`;
    }

    let queue = [0];
    let ix = 1;
    let nodes = [];
    
    while (queue.length > 0 && ix < vector.length) {
        let tmp = [];

        while (queue.length > 0 && ix < vector.length) {
            let i = queue.shift();
            console.log(queue, tmp);
            nodes.push(`${i} [label="${vector[i]}"];`);

            if (ix < vector.length && vector[ix] !== null) {
                nodes.push(`${ix} [label="${vector[ix]}"];`);
                nodes.push(`${i} -> ${ix};`);
                tmp.push(ix);
            }
            ix++;

            if (ix < vector.length && vector[ix] !== null) {
                nodes.push(`${ix} [label="${vector[ix]}"];`);
                nodes.push(`${i} -> ${ix};`);
                tmp.push(ix);
            }
            ix++;
        }

        queue = tmp.slice();
    }

    return `
    digraph G { 
        graph [bgcolor=transparent]; 
        node [color=white, fontcolor=white]; 
        edge [color=white]; 
        ${nodes.join("\n")} 
    }`;
}