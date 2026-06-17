let clickX, clickY;

// Handle file upload
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.getElementById('annotationCanvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            document.getElementById('uploadBox').style.display = 'none';
            document.getElementById('canvasContainer').style.display = 'block';
            canvas.addEventListener('click', handleCanvasClick);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(file);
});

// Handle canvas click
function handleCanvasClick(e) {
    const canvas = document.getElementById('annotationCanvas');
    const rect = canvas.getBoundingClientRect();
    clickX = e.clientX - rect.left;
    clickY = e.clientY - rect.top;
    drawPin(clickX, clickY);
    openPopup();
}

// Draw pin on canvas
function drawPin(x, y) {
    const canvas = document.getElementById('annotationCanvas');
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = '#e94560';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Open popup
function openPopup() {
    document.getElementById('popupOverlay').style.display = 'flex';
}

// Close popup
function closePopup() {
    document.getElementById('popupOverlay').style.display = 'none';
}

// Save bug to backend
async function saveBug() {
    const title = document.getElementById('bugTitle').value;
    const description = document.getElementById('bugDescription').value;
    const assignedTo = document.getElementById('assignedTo').value;

    if (!title) {
        alert('Please enter a bug title!');
        return;
    }

    const bug = {
        title: title,
        description: description,
        assignedTo: assignedTo,
        xPosition: clickX,
        yPosition: clickY,
        screenshotUrl: 'local',
        status: 'OPEN'
    };

    try {
        const response = await fetch('http://localhost:8080/api/bugs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bug)
        });

        if (response.ok) {
            alert('Bug pinned successfully! ✅');
            closePopup();
            document.getElementById('bugTitle').value = '';
            document.getElementById('bugDescription').value = '';
            document.getElementById('assignedTo').value = '';
        }
    } catch (error) {
        alert('Error saving bug. Make sure backend is running!');
    }
}