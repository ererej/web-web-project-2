const itemspawners = document.getElementsByClassName("item-spawner");
const drawingArea = document.getElementById("drawing-area");
let rows = 5;
let columns = 9;
let cellHeight = 65/rows;
console.log(document.documentElement.clientWidth || 0, window.innerWidth || 0);
console.log(document.documentElement.clientWidth);
const getCellWidth = () => {
    const cell = document.querySelector("#drawing-area > div");
    return cell ? cell.getBoundingClientRect().width/window.innerWidth*100 : 78/columns;
};
let cellWidth = getCellWidth();
let grid = [];
let gridEnabled = true;


const addLoadButton = (saveName) => {
    const dropDown = document.getElementById("saves-dropdown");
    const element = document.createElement("button");
    element.classList.add("saves-dropdown-button");
    element.classList.add("saves-dropdown-content");    
    element.innerHTML = saveName;
    dropDown.appendChild(element);
    element.addEventListener("click", function() {
        const tempGrid = JSON.parse(getCookie("rooms"))[saveName].grid;
        rows = JSON.parse(getCookie("rooms"))[saveName].layout.rows;
        columns = JSON.parse(getCookie("rooms"))[saveName].layout.columns;
        cellHeight = 65/rows;
        cellWidth = getCellWidth();
        drawingArea.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        drawingArea.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
        document.getElementById("room-name").value = saveName;
        document.getElementById("columns").value = columns;
        document.getElementById("rows").value = rows;
        clearGrid();
        for (let i=0; i<tempGrid.length; i++) {
            for (let j=0; j<tempGrid[i].length; j++) {
                const cell = document.querySelector(`#drawing-area > div[style*="grid-column-start: ${i+1}; grid-row-start: ${j+1};"]`);
                if (tempGrid[i][j][0] === null) {
                    cell.classList.remove();
                    continue;
                } else {
                    cell.style.backgroundColor = tempGrid[i][j][0].color;
                    cell.innerHTML = tempGrid[i][j][1];
                    cell.classList.add("rounded");
                }
                cell.style.backgroundColor = tempGrid[i][j][0].color;
                cell.innerHTML = tempGrid[i][j][1];
            }
        }
        grid = tempGrid;
    });
};


const clearGrid = () => {
    drawingArea.innerHTML = "";
    for (let i=1; i<=columns; i++) {
        for (let j=1; j<=rows; j++) {
            const gridItem = document.createElement("div");
            gridItem.style.gridColumnStart = `${i}`;
            gridItem.style.gridRowStart = `${j}`;
            gridItem.style.backgroundColor = "white";
            gridItem.style.border = "1px solid grey";
            gridItem.style.padding = window.getComputedStyle(gridItem).padding -2;
            drawingArea.appendChild(gridItem);
            cellWidth = getCellWidth();
        }
    }
    grid = [];
    for (let i=0; i<columns; i++) {
        grid.push([]);
        for (let j=0; j<rows; j++) {
            grid[i].push([null/*itemtype*/ , "placeholder"/*student name*/]);
        }
    }
};

let classNames = "";
try {
    if (getCookie("rooms") != "") {
        classNames = JSON.parse(getCookie("rooms"));
    }
} catch (error) {}
if (getCookie("rooms") != "") {
    classNames = JSON.parse(getCookie("rooms"));
}
if (classNames && typeof classNames === "object" && Object.keys(classNames).length > 0){
    classNames = Object.keys(classNames);
    classNames.forEach(async (name) => {
        addLoadButton(name);
    });
}

clearGrid();

document.getElementById("create-new-room").addEventListener("click", function() {// enables the form to create a new room
    const form = document.getElementById("create-room-form");
    for (i in form.children) {
        form.children[i].disabled = false;
    }
    document.getElementById("room-name").focus();
    gridEnabled = false;
    clearGrid();
});

const columnsInput = document.getElementById("columns");
columnsInput.addEventListener("change", function() {// updates the number of columns in the grid when the user changes the input
    columns = parseInt(columnsInput.value);
    drawingArea.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    clearGrid();
    cellWidth = getCellWidth();
});

const rowsInput = document.getElementById("rows");
rowsInput.addEventListener("change", function() {// updates the number of rows in the grid when the user changes the input
    rows = parseInt(rowsInput.value);
    drawingArea.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    clearGrid();
    cellHeight = 65/rows;
});

document.getElementById("create-room").addEventListener("click", function(event) {
    const formInputs = document.querySelectorAll("#create-room-form > input");
    if (formInputs[0].value == "" || formInputs[1].value == "" || formInputs[2].value == "") {//checks if any of the inputs are empty
        return;
    }
    event.preventDefault();
    formInputs.forEach(input => {
        input.disabled = true;
    });
    gridEnabled = true;
});

//attatches event listeners to all itemspawners
for (let i=0; i<itemspawners.length; i++) {
    itemspawners[i].addEventListener("click", function(event) {
        event.target.style.border = "2px solid green";
        document.getElementById("ghost-item");
        if (document.getElementById("ghost-item")) {
            document.getElementById("ghost-item").remove();
        }
        const item = document.createElement("div");
        item.id = "ghost-item";
        item.innerHTML = event.target.innerHTML;
        item.style.visibility = "hidden";
        item.style.width = `${cellWidth}vw`;
        item.style.height = `${cellHeight}vh`;
        item.style.backgroundColor = window.getComputedStyle(event.target).backgroundColor;
        item.style.opacity = "0.5";
        item.style.position = "absolute";
        item.classList.add("rounded");
        document.getElementById("drawing-area").appendChild(item);
    });
}

drawingArea.addEventListener("click", function(event) {
    if (!gridEnabled) return;
    const ghostItem = document.getElementById("ghost-item");
    ghostItem.style.visibility = "hidden";
    if (ghostItem) {
        const ghostItemBox = ghostItem.getBoundingClientRect();
        const drawingAreaBox = drawingArea.getBoundingClientRect();
        if (grid[Math.floor((event.clientX-drawingAreaBox.left)/ghostItemBox.width)][Math.floor((event.clientY-drawingAreaBox.top)/ghostItemBox.height)] != null) {
            grid[Math.floor((event.clientX-drawingAreaBox.left)/ghostItemBox.width)][Math.floor((event.clientY-drawingAreaBox.top)/ghostItemBox.height)][0] = {color: ghostItem.style.backgroundColor};
            grid[Math.floor((event.clientX-drawingAreaBox.left)/ghostItemBox.width)][Math.floor((event.clientY-drawingAreaBox.top)/ghostItemBox.height)][1] = ghostItem.innerHTML;
            const cell = document.querySelector(`#drawing-area > div[style*="grid-column-start: ${Math.floor((event.clientX-drawingAreaBox.left)/ghostItemBox.width) + 1}; grid-row-start: ${Math.floor((event.clientY-drawingAreaBox.top)/ghostItemBox.height) + 1};"]`);
            cell.style.backgroundColor = ghostItem.style.backgroundColor;
            cell.innerHTML = ghostItem.innerHTML;
            cell.classList.add("rounded");
        }        
    }
});

document.addEventListener("mousemove", function(event) { // show the user a prewiew of the item they are about to place
    if (!gridEnabled) return;
    const ghostItem = document.getElementById("ghost-item");
    if (ghostItem) {
        const ghostItemBox = ghostItem.getBoundingClientRect();
        const drawingAreaBox = drawingArea.getBoundingClientRect();
        if (drawingAreaBox.left < event.clientX && event.clientX < drawingAreaBox.right - 4 && drawingAreaBox.top < event.clientY && event.clientY < drawingAreaBox.bottom) {
            ghostItem.style.visibility = "visible";
            if (grid[Math.floor((event.clientX-drawingAreaBox.left)/ghostItemBox.width)][Math.floor((event.clientY-drawingAreaBox.top)/ghostItemBox.height)] != null) {
                ghostItem.style.left = `${4 + window.scrollX + drawingAreaBox.left + Math.floor((event.clientX-drawingAreaBox.left)/ghostItemBox.width)*ghostItemBox.width}px`;
                ghostItem.style.top = `${4 + window.scrollY + drawingAreaBox.top + Math.floor((event.clientY-drawingAreaBox.top)/ghostItemBox.height)*ghostItemBox.height}px`;
            }
        } else {
            ghostItem.style.visibility = "hidden";
        }
    }
});


document.getElementById("save-button").addEventListener("click", function() { // saves the current room to a cookie
    const name = document.getElementById("room-name").value;
    if (name == "") {
        return;
    }
    if (!getCookie("rooms")) {
        setCookie("rooms", JSON.stringify({[name]: {grid: grid, layout: {rows: rows, columns: columns}}}), 365);
    }
    const seatingPlans = JSON.parse(getCookie("rooms"));
    seatingPlans[name] = {grid: grid, layout: {rows: rows, columns: columns}};
    setCookie("rooms", JSON.stringify(seatingPlans), 365);
    document.querySelectorAll(".saves-dropdown-button").forEach(element => {
        if (element.innerHTML == name) {element.remove();}
    });
    addLoadButton(name);
});
// shows the dropdown menu when the user clicks the load button
function showSaves() {
    const content = document.getElementsByClassName("saves-dropdown-content");
    for (let i=0; i<content.length; i++) {
        content[i].classList.toggle("show");
    }
}
// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('#loadButton')) {
        const dropdowns = document.getElementsByClassName("saves-dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            } 
        }
    }
};

window.onresize = function() { // breaks if the grid changes between being full width and not. but refreshing fixes it so it would work on all platforms
    cellWidth = getCellWidth();
};