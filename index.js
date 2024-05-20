const itemspawners = document.getElementsByClassName("item-spawner")
const drawingArea = document.getElementById("drawing-area")
const rows = 5
const columns = 9
const gridheight = 65/rows
const gridWidth = 78/columns
const grid = []

getCookie

for (let i=0; i<9; i++) {
    grid.push([])
    for (let j=0; j<5; j++) {
        grid[i].push([null/*itemtype*/ , "placeholder"/*student name*/])
    }
}

for (let i=1; i<=columns; i++) {
    for (let j=1; j<=rows; j++) {
        const gridItem = document.createElement("div")
        gridItem.style.gridColumnStart = `${i}`
        gridItem.style.gridRowStart = `${j}`
        gridItem.style.backgroundColor = "white"
        drawingArea.appendChild(gridItem)
    }
}

class seat {
    constructor(type, width, height, color) {
        this.width = 1
        this.height = 1
        this.color = color
        this.type = type
    }
}


for (let i=0; i<itemspawners.length; i++) {
    itemspawners[i].addEventListener("click", function() {
    document.getElementById("ghost-item")
    if (document.getElementById("ghost-item")) {
      document.getElementById("ghost-item").remove()
    }
    const item = document.createElement("div")
    item.id = "ghost-item"
    item.style.width = `${gridWidth}vw`;
    item.style.height = `${gridheight}vh`;
    item.style.backgroundColor = itemspawners[i].style.backgroundColor
    item.style.opacity = "0.5"
    item.style.position = "absolute"
    document.getElementById("drawing-area").appendChild(item)
  })
}

drawingArea.addEventListener("click", function(event) {
    const ghostItem = document.getElementById("ghost-item")
    if (ghostItem) {
        const ghostItemBox = ghostItem.getBoundingClientRect()
        const drawingAreaBox = drawingArea.getBoundingClientRect()
        if (grid[Math.floor((event.clientX-drawingAreaBox.left)/ghostItemBox.width)][Math.floor((event.clientY-drawingAreaBox.top)/ghostItemBox.height)] != null) {
            grid[Math.floor((event.clientX-drawingAreaBox.left)/ghostItemBox.width)][Math.floor((event.clientY-drawingAreaBox.top)/ghostItemBox.height)][0] = ghostItem.id
            console.table(grid)
            drawingArea.childNodes.forEach(async (element) => {
                if (element.style.gridColumnStart == Math.floor((event.clientX-drawingAreaBox.left)/ghostItemBox.width + 1) && element.style.gridRowStart == Math.floor((event.clientY-drawingAreaBox.top)/ghostItemBox.height + 1)) {
                    element.style.backgroundColor = ghostItem.style.backgroundColor
                    element.innerHTML = ghostItem.innerHTML
                }
            })
        }        
    }
})

document.addEventListener("mousemove", function(event) {
    const ghostItem = document.getElementById("ghost-item")
    if (ghostItem) {
        const ghostItemBox = ghostItem.getBoundingClientRect()
        const drawingAreaBox = drawingArea.getBoundingClientRect()
        if (drawingAreaBox.left < event.clientX && event.clientX < drawingAreaBox.right && drawingAreaBox.top < event.clientY && event.clientY < drawingAreaBox.bottom) {
            if (grid[Math.floor((event.clientX-drawingAreaBox.left)/ghostItemBox.width)][Math.floor((event.clientY-drawingAreaBox.top)/ghostItemBox.height)] != null) {
                ghostItem.style.gridColumnStart = `${Math.floor((event.clientX-drawingAreaBox.left)/ghostItemBox.width)}`
                ghostItem.style.gridRowStart = `${Math.floor((event.clientY-drawingAreaBox.top)/ghostItemBox.height)}`
            }
        }
    }
})


document.getElementById("saveButton").addEventListener("click", function() {
    const name = prompt("give the classroom a name")
    if (getCookie("seatingPlans") == "") {
        setCookie("seatingPlans", JSON.stringify([{[name]: grid}]))
    }
    setCookie("seatingPlans", JSON.stringify(JSON.parse(getCookie("seatingPlans")).push({[name]: grid})))
})

function showSaves() {
    document.getElementById("myDropdown").classList.toggle("show");
  }

window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

document.getElementById("loadButton").addEventListener("click", function() {
    const grid = JSON.parse(getCookie("seating "))
    for (let i=0; i<9; i++) {
        for (let j=0; j<5; j++) {
            if (grid[i][j][0] != null) {
                drawingArea.childNodes.forEach(async (element) => {
                    if (element.style.gridColumnStart == i+1 && element.style.gridRowStart == j+1) {
                        element.style.backgroundColor = grid[i][j][0]
                        element.innerHTML = grid[i][j][0]
                    }
                })
            }
        }
    }
})

// taken from stakoverflow
function setCookie(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}
// taken from stakoverflow
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}