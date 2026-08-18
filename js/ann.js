/* ========================================= */
/* ============ CANVAS SETUP =============== */
/* ========================================= */

const canvas = document.getElementById("neural-network");
const ctx = canvas.getContext("2d");
let width;
let height;

/* ========================================= */
/* ============== SETTINGS ================= */
/* ========================================= */

const NODE_COUNT = 220;
const CONNECTION_DISTANCE = 120;
const SIGNAL_COUNT = 40;
const MOUSE_RADIUS = 150;

/* ========================================= */
/* ================ DATA =================== */
/* ========================================= */

const nodes = [];
const signals = [];

/* ========================================= */
/* ================ MOUSE ================== */
/* ========================================= */

const mouse = {
    x: null,
    y: null
};

/* ========================================= */
/* =========== RESIZE CANVAS =============== */
/* ========================================= */

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createNodes();
    createSignals();
}

/* ========================================= */
/* ============== CREATE NODES ============= */
/* ========================================= */

function createNodes() {
    nodes.length = 0;

    for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            radius: Math.random() * 1.8 + 1,
            phase: Math.random() * Math.PI * 2
        });
    }
}

/* ========================================= */
/* ============ CREATE SIGNALS ============ */
/* ========================================= */

function createSignals() {
    signals.length = 0;

    for (let i = 0; i < SIGNAL_COUNT; i++) {
        const signal = {
            from: Math.floor(Math.random() * NODE_COUNT),
            to: null,
            progress: Math.random(),
            speed: 0.002 + Math.random() * 0.004
        };

        chooseConnection(signal);
        signals.push(signal);
    }
}

/* ========================================= */
/* ========= FIND NEARBY NODE ============== */
/* ========================================= */

function chooseConnection(signal) {
    const source = nodes[signal.from];
    const nearbyNodes = [];

    nodes.forEach((node, index) => {
        if (index === signal.from) {
            return;
        }

        const dx = source.x - node.x;
        const dy = source.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < CONNECTION_DISTANCE) {
            nearbyNodes.push(index);
        }
    });

    if (nearbyNodes.length > 0) {
        signal.to = nearbyNodes[Math.floor(Math.random() * nearbyNodes.length)];
    } else {
        signal.to = Math.floor(Math.random() * NODE_COUNT);
    }
}

/* ========================================= */
/* ============== MOUSE ==================== */
/* ========================================= */

window.addEventListener("mousemove", function(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener("mouseleave", function() {
    mouse.x = null;
    mouse.y = null;
});

/* ========================================= */
/* =========== UPDATE NODES ================ */
/* ========================================= */

function updateNodes(time) {
    nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        /* Gentle organic movement */

        node.x += Math.sin(time * 0.0005 + node.phase) * 0.08;
        node.y += Math.cos(time * 0.0004 + node.phase) * 0.08;

        /* Screen wrapping */

        if (node.x < 0) {
            node.x = width;
        }

        if (node.x > width) {
            node.x = 0;
        }

        if (node.y < 0) {
            node.y = height;
        }

        if (node.y > height) {
            node.y = 0;
        }

        /* Mouse interaction */

        if (mouse.x !== null && mouse.y !== null) {
            const dx = node.x - mouse.x;
            const dy = node.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < MOUSE_RADIUS && distance > 0) {
                const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS;

                node.x += (dx / distance) * force * 1.2;
                node.y += (dy / distance) * force * 1.2;
            }
        }
    });
}

/* ========================================= */
/* ========= DRAW CONNECTIONS ============== */
/* ========================================= */

function drawConnections() {
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < CONNECTION_DISTANCE) {
                const opacity = (1 - distance / CONNECTION_DISTANCE) * 0.28;

                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.strokeStyle = `rgba(245, 238, 241, ${opacity})`;
                ctx.lineWidth = 0.7;
                ctx.stroke();
            }
        }
    }
}

/* ========================================= */
/* ============== DRAW NODES =============== */
/* ========================================= */

function drawNodes(time) {
    nodes.forEach(node => {
        const pulse = Math.sin(time * 0.002 + node.phase);
        const radius = node.radius + pulse * 0.35;

        ctx.beginPath();
        ctx.arc(
            node.x,
            node.y,
            Math.max(radius, 0.5),
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "rgba(245, 238, 241, 0.65)";
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(232, 201, 214, 0.35)";
        ctx.fill();
        ctx.shadowBlur = 0;
    });
}

/* ========================================= */
/* ============== DRAW SIGNALS ============= */
/* ========================================= */

function drawSignals() {
    signals.forEach(signal => {
        if (signal.to === null) {
            chooseConnection(signal);
            return;
        }

        const start = nodes[signal.from];
        const end = nodes[signal.to];

        const x = start.x + (end.x - start.x) * signal.progress;
        const y = start.y + (end.y - start.y) * signal.progress;

        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = "#E8C9D6";
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#E8C9D6";
        ctx.fill();
        ctx.shadowBlur = 0;

        signal.progress += signal.speed;

        if (signal.progress >= 1) {
            signal.progress = 0;
            signal.from = signal.to;
            chooseConnection(signal);
        }
    });
}

/* ========================================= */
/* =============== ANIMATION =============== */
/* ========================================= */

function animate(time) {
    ctx.clearRect(0, 0, width, height);
    updateNodes(time);
    drawConnections();
    drawSignals();
    drawNodes(time);
    requestAnimationFrame(animate);
}

/* ========================================= */
/* =============== START =================== */
/* ========================================= */

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
requestAnimationFrame(animate);