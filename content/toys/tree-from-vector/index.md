+++
title = "Visualize tree from vector"
date = 2024-09-08
authors = ["hyouteki"]
description = "A visualization toy to convert a vector into a binary tree"
[taxonomies]
tags = ["js", "graphviz", "visualization", "toy"]
+++

<br>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="../styles.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/viz.js/2.1.2/viz.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/viz.js/2.1.2/full.render.js"></script>
</head>
<body>
    <textarea id="vector" rows="3">1,4,4,null,2,2,null,1,null,6,8,null,null,null,null,1,3</textarea>
    <button onclick="generateTree()">Generate Tree</button>
    <div id="graph"></div>
    <script src="./index.js"></script>
</body>
</html>