let life = 52;
const itemspawners = document.getElementsByClassName("item-spawner")
const drawingArea = document.getElementById("drawing-area")
const rows = 5
const columns = 9
const gridheight = 65/rows
const gridWidth = 78/columns
const grid = []

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
// taken from w3schools
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

const addLoadButton = (saveName) => {
    const dropDown = document.getElementById("saves-dropdown")
    const element = document.createElement("button")
    element.classList.add("saves-dropdown-button")
    element.classList.add("saves-dropdown-content")

    element.innerHTML = saveName
    dropDown.appendChild(element)
    element.addEventListener("click", function() {
        const grid = JSON.parse(getCookie("seatingPlans"))[saveName]
        for (let i=0; i<9; i++) {
            for (let j=0; j<5; j++) {
                    drawingArea.childNodes.forEach(async (element) => {
                        if (element.style.gridColumnStart == i+1 && element.style.gridRowStart == j+1) {
                            element.style.backgroundColor = grid[i][j][0].color
                            element.innerHTML = grid[i][j][1]
                            element.classList.add("seat")
                        }
                    })
            }
        }
    })
}

let saveNames = ""
try {
    if (getCookie("seatingPlans") != "") {
        saveNames = JSON.parse(getCookie("seatingPlans"))
    }
} catch (error) {
    console.log("no saves")
}
if (getCookie("seatingPlans") != "") {
    saveNames = JSON.parse(getCookie("seatingPlans"))
}
if (saveNames && typeof saveNames === "object" && Object.keys(saveNames).length > 0){
    saveNames = Object.keys(saveNames)
    saveNames.forEach(async (name) => {
        addLoadButton(name)
    })
}

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
            grid[Math.floor((event.clientX-drawingAreaBox.left)/ghostItemBox.width)][Math.floor((event.clientY-drawingAreaBox.top)/ghostItemBox.height)][0] = {color: ghostItem.style.backgroundColor}
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
    if (name == null || name.length <= 0) return

    console.log(name)
    if (getCookie("seatingPlans") == "") {
        setCookie("seatingPlans", JSON.stringify({[name]: grid}))
    }
    const seatingPlans = JSON.parse(getCookie("seatingPlans"))
    seatingPlans[name] = grid
    setCookie("seatingPlans", JSON.stringify(seatingPlans))
    addLoadButton(name)
    console.log(JSON.parse(getCookie("seatingPlans")))
})

function showSaves() {
    const content = document.getElementsByClassName("saves-dropdown-content")
    for (let i=0; i<content.length; i++) {
        content[i].classList.toggle("show")
    }
}

window.onclick = function(event) {
    if (!event.target.matches('#loadButton')) {
        var dropdowns = document.getElementsByClassName("saves-dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
                console.log("hiding")
            } 
        }
    }
}


