const data = {
    nodes: [
        { id: 1, label: "🌍 AI Landscape", group: "main" },
        { id: 2, label: "🤖 Machine Learning", group: "ml" },
        { id: 3, label: "🧠 Deep Learning", group: "dl" },
        { id: 4, label: "🎮 Reinforcement Learning", group: "rl" },
        { id: 5, label: "📝 NLP", group: "nlp" },
        { id: 6, label: "📸 Computer Vision", group: "cv" },
        { id: 7, label: "🎨 Generative AI", group: "genai" },
        { id: 21, label: "Supervised Learning", group: "ml" },
        { id: 22, label: "Unsupervised Learning", group: "ml" },
        { id: 23, label: "Semi-Supervised Learning", group: "ml" },
        { id: 24, label: "Self-Supervised Learning", group: "ml" },
        { id: 31, label: "Neural Networks", group: "dl" },
        { id: 32, label: "Deep Learning Applications", group: "dl" },
        { id: 41, label: "RL Algorithms", group: "rl" },
        { id: 42, label: "Reinforcement Learning Applications", group: "rl" },
        { id: 51, label: "Large Language Models", group: "nlp" },
        { id: 52, label: "NLP Core Areas", group: "nlp" },
        { id: 53, label: "NLP Tools", group: "nlp" },
        { id: 61, label: "CV Applications", group: "cv" },
        { id: 62, label: "CV Techniques", group: "cv" },
        { id: 63, label: "CV Tools", group: "cv" },
        { id: 71, label: "Generative AI Tools", group: "genai" },
        { id: 72, label: "LLMs", group: "genai" },
        { id: 73, label: "Image Generation", group: "genai" },
        { id: 74, label: "Video Generation", group: "genai" },
        { id: 75, label: "Speech Generation", group: "genai" },
        { id: 76, label: "Music & Audio", group: "genai" }
    ],
    links: [
        { source: 1, target: 2 }, { source: 1, target: 3 }, { source: 1, target: 4 }, { source: 1, target: 5 }, { source: 1, target: 6 }, { source: 1, target: 7 },
        { source: 2, target: 21 }, { source: 2, target: 22 }, { source: 2, target: 23 }, { source: 2, target: 24 },
        { source: 3, target: 31 }, { source: 3, target: 32 },
        { source: 4, target: 41 }, { source: 4, target: 42 },
        { source: 5, target: 51 }, { source: 5, target: 52 }, { source: 5, target: 53 },
        { source: 6, target: 61 }, { source: 6, target: 62 }, { source: 6, target: 63 },
        { source: 7, target: 71 }, { source: 7, target: 72 }, { source: 7, target: 73 }, { source: 7, target: 74 }, { source: 7, target: 75 }, { source: 7, target: 76 }
    ]
};

const width = window.innerWidth;
const height = window.innerHeight;

const svg = d3.select("#mindmap")
    .attr("width", width)
    .attr("height", height);

const centerX = width / 2;
const centerY = height / 2;
const spreadFactor = Math.min(width, height) / 2.2;

// Distribute nodes in a spiral pattern inside the viewport
data.nodes.forEach((node, i) => {
    const angle = (i / data.nodes.length) * Math.PI * 2;
    const radius = spreadFactor * Math.sqrt(i / data.nodes.length);
    node.x = centerX + radius * Math.cos(angle);
    node.y = centerY + radius * Math.sin(angle);
});

const link = svg.selectAll("line")
    .data(data.links)
    .enter().append("line")
    .style("stroke", "#999")
    .style("stroke-width", 2);

// Node groups containing both rectangle and text
const nodeGroup = svg.selectAll(".node")
    .data(data.nodes)
    .enter().append("g")
    .attr("class", "node")

// Create a rectangle for each node
const nodeBox = nodeGroup.append("rect")
    .attr("rx", 8).attr("ry", 8)  // Rounded corners
    .attr("height", 30)
    .attr("width", d => d.label.length * 11 + 20)  // Auto-sizing based on text
    .attr("fill", d => {
        const colors = {
            main: "#ffcc00", ml: "#ff6666", dl: "#66ccff", rl: "#99cc66", 
            nlp: "#ff9966", cv: "#9966cc", genai: "#cc6699"
        };
        return colors[d.group] || "#aaa";
    })
    .attr("stroke", "#333")
    .attr("stroke-width", 2);

// Add text inside the rectangle
const text = nodeGroup.append("text")
    .attr("dx", 10)
    .attr("dy", 20)
    .text(d => d.label)
    .style("fill", "#000")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .style("pointer-events", "none");  // Prevents interference with dragging

    const simulation = d3.forceSimulation(data.nodes)
    .force("link", d3.forceLink(data.links).id(d => d.id).distance(200))
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(centerX, centerY))
    .force("collision", d3.forceCollide(60))  
    .on("tick", ticked);

function ticked() {
    link
        .attr("x1", d => Math.max(40, Math.min(width - 40, d.source.x)))
        .attr("y1", d => Math.max(20, Math.min(height - 20, d.source.y)))
        .attr("x2", d => Math.max(40, Math.min(width - 40, d.target.x)))
        .attr("y2", d => Math.max(20, Math.min(height - 20, d.target.y)));

    nodeGroup
        .attr("transform", d => `translate(${Math.max(40, Math.min(width - 40, d.x - d.label.length * 5 - 10))}, 
                                          ${Math.max(20, Math.min(height - 20, d.y - 15))})`);
}

