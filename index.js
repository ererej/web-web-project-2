let life = 52;
const itemspawners = document.getElementsByClassName("item-spawner")
const drawingArea = document.getElementById("drawing-area")
let rows = 5
let columns = 9
let cellHeight = 65/rows
let cellWidth = 78/columns
const grid = []
let gridEnabled = true


const addLoadButton = (saveName) => {
    const dropDown = document.getElementById("saves-dropdown")
    const element = document.createElement("button")
    element.classList.add("saves-dropdown-button")
    element.classList.add("saves-dropdown-content")

    element.innerHTML = saveName
    dropDown.appendChild(element)
    element.addEventListener("click", function() {
        const grid = JSON.parse(getCookie("seatingPlans"))[saveName].grid
        rows = JSON.parse(getCookie("seatingPlans"))[saveName].layout.rows
        columns = JSON.parse(getCookie("seatingPlans"))[saveName].layout.columns
        drawingArea.style.gridTemplateColumns = `repeat(${columns}, 1fr)`
        drawingArea.style.gridTemplateRows = `repeat(${rows}, 1fr)`
        document.getElementById("room-name").value = saveName
        document.getElementById("columns").value = columns
        document.getElementById("rows").value = rows
        clearGrid()
        for (let i=0; i<grid.length; i++) {
            for (let j=0; j<grid[i].length; j++) {
                drawingArea.childNodes.forEach(async (element) => {
                    if (element.style.gridColumnStart == i+1 && element.style.gridRowStart == j+1) {
                        if (grid[i][j][0] === null) return
                        element.style.backgroundColor = grid[i][j][0].color
                        element.innerHTML = grid[i][j][1]
                        element.classList.add("seat")
                    }
                })
            }
        }
    })
}


const clearGrid = () => {
    drawingArea.innerHTML = ""
    for (let i=1; i<=columns; i++) {
        for (let j=1; j<=rows; j++) {
            const gridItem = document.createElement("div")
            gridItem.style.gridColumnStart = `${i}`
            gridItem.style.gridRowStart = `${j}`
            gridItem.style.backgroundColor = "white"
            gridItem.style.border = "1px solid grey"
            gridItem.style.padding = gridItem.style.padding -2
            drawingArea.appendChild(gridItem)
        }
    }
    for (let i=0; i<columns; i++) {
        grid.push([])
        for (let j=0; j<rows; j++) {
            grid[i].push([null/*itemtype*/ , "placeholder"/*student name*/])
        }
    }
}

let classNames = ""
try {
    if (getCookie("seatingPlans") != "") {
        classNames = JSON.parse(getCookie("seatingPlans"))
    }
} catch (error) {
    console.log("no saves")
}
if (getCookie("seatingPlans") != "") {
    classNames = JSON.parse(getCookie("seatingPlans"))
}
if (classNames && typeof classNames === "object" && Object.keys(classNames).length > 0){
    classNames = Object.keys(classNames)
    classNames.forEach(async (name) => {
        addLoadButton(name)
    })
}

clearGrid()
class seat {
    constructor(type, width, height, color) {
        this.width = 1
        this.height = 1
        this.color = color
        this.type = type
    }
}

document.getElementById("create-new-room").addEventListener("click", function() {
    const form = document.getElementById("create-room-form")
    for (i in form.children) {
        form.children[i].disabled = false
    }
    gridEnabled = false
    clearGrid()
})

const columnsInput = document.getElementById("columns")
columnsInput.addEventListener("change", function() {
    columns = columnsInput.value
    drawingArea.style.gridTemplateColumns = `repeat(${columns}, 1fr)`
    clearGrid()
    cellWidth = 78/columns
})

const rowsInput = document.getElementById("rows")
rowsInput.addEventListener("change", function() {
    rows = rowsInput.value
    drawingArea.style.gridTemplateRows = `repeat(${rows}, 1fr)`
    clearGrid()
    cellHeight = 65/rows
})

document.getElementById("create-room").addEventListener("click", function(event) {
    const formInputs = document.querySelectorAll("#create-room-form > input")
    if (formInputs[0].value == "" || formInputs[1].value == "" || formInputs[2].value == "") {
        return
    }
    event.preventDefault()
    formInputs.forEach(input => {
        input.disabled = true
    })
    gridEnabled = true
})

for (let i=0; i<itemspawners.length; i++) {
    itemspawners[i].addEventListener("click", function() {
    document.getElementById("ghost-item")
    if (document.getElementById("ghost-item")) {
      document.getElementById("ghost-item").remove()
    }
    const item = document.createElement("div")
    item.id = "ghost-item"
    item.style.visibility = "hidden"
    item.style.width = `${cellWidth}vw`;
    item.style.height = `${cellHeight}vh`;
    item.style.backgroundColor = itemspawners[i].style.backgroundColor
    item.style.opacity = "0.5"
    item.style.position = "absolute"
    document.getElementById("drawing-area").appendChild(item)
  })
}

drawingArea.addEventListener("click", function(event) {
    if (!gridEnabled) return
    const ghostItem = document.getElementById("ghost-item")
    if (ghostItem) {
        const ghostItemBox = ghostItem.getBoundingClientRect()
        const drawingAreaBox = drawingArea.getBoundingClientRect()
        if (grid[Math.floor((event.clientX-drawingAreaBox.left)/ghostItemBox.width)][Math.floor((event.clientY-drawingAreaBox.top)/ghostItemBox.height)] != null) {
            grid[Math.floor((event.clientX-drawingAreaBox.left)/ghostItemBox.width)][Math.floor((event.clientY-drawingAreaBox.top)/ghostItemBox.height)][0] = {color: ghostItem.style.backgroundColor}
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
    if (!gridEnabled) return
    const ghostItem = document.getElementById("ghost-item")
    if (ghostItem) {
        const ghostItemBox = ghostItem.getBoundingClientRect()
        const drawingAreaBox = drawingArea.getBoundingClientRect()
        if (drawingAreaBox.left < event.clientX && event.clientX < drawingAreaBox.right - 4 && drawingAreaBox.top < event.clientY && event.clientY < drawingAreaBox.bottom) {
            ghostItem.style.visibility = "visible"
            if (grid[Math.floor((event.clientX-drawingAreaBox.left)/ghostItemBox.width)][Math.floor((event.clientY-drawingAreaBox.top)/ghostItemBox.height)] != null) {
                ghostItem.style.left = `${2 + window.scrollX + drawingAreaBox.left + Math.floor((event.clientX-drawingAreaBox.left)/ghostItemBox.width)*ghostItemBox.width}px`
                ghostItem.style.top = `${2 + window.scrollY + drawingAreaBox.top + Math.floor((event.clientY-drawingAreaBox.top)/ghostItemBox.height)*ghostItemBox.height}px`}
            } else {
            ghostItem.style.visibility = "hidden"
        }
    }
})


document.getElementById("save-button").addEventListener("click", function() {
    const name = document.getElementById("room-name").value
    if (name == "") {
        return
    }
    if (!getCookie("seatingPlans")) {
        console.log({[name]: {grid: grid, layout: {rows: rows, columns: columns}}})
        setCookie("seatingPlans", JSON.stringify({[name]: {grid: grid, layout: {rows: rows, columns: columns}}}), 365)
    }
    console.log(getCookie("seatingPlans"))
    const seatingPlans = JSON.parse(getCookie("seatingPlans"))
    seatingPlans[name] = {grid: grid, layout: {rows: rows, columns: columns}}
    setCookie("seatingPlans", JSON.stringify(seatingPlans), 365)
    document.querySelectorAll(".saves-dropdown-button").forEach(element => {
        if (element.innerHTML == name) {element.remove()}
    })
    addLoadButton(name)
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
            } 
        }
    }
}
