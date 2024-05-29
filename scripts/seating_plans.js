let grid = []
let rows = 1
let columns = 1
const drawingArea = document.getElementById("drawing-area")


const fillGrid = (students) => {
    drawingArea.innerHTML = ""
    let studentsLeft = students
    for (let i=1; i<=columns; i++) {
        for (let j=1; j<=rows; j++) {
            const gridItem = document.createElement("div")
            gridItem.style.gridColumnStart = `${i}`
            gridItem.style.gridRowStart = `${j}`
            gridItem.style.border = "1px solid grey"
            gridItem.style.padding = gridItem.style.padding -2
            if (grid[i-1][j-1][0] === null) {
                gridItem.style.backgroundColor = "white"
            } else {
                gridItem.style.backgroundColor = grid[i-1][j-1][0].color
                gridItem.innerHTML = grid[i-1][j-1][1]
                gridItem.classList.add("rounded")
                if (grid[i-1][j-1][1] === "Teachers Desk") {
                    gridItem.innerHTML = grid[i-1][j-1][1]
                } else if (studentsLeft.length > 0) {
                    const student = studentsLeft.pop()
                    gridItem.innerHTML = student
                    grid[i-1][j-1][1] = student
                }
            }
            drawingArea.appendChild(gridItem)
        }
    }
    //grid = []
    // for (let i=0; i<columns; i++) {
    //     grid.push([])
    //     for (let j=0; j<rows; j++) {
    //         grid[i].push([null/*itemtype*/ , "placeholder"/*student name*/])
    //     }
    // }
}


const addRoomOption = (saveName) => {
    const roomDropDown = document.getElementById("room")
    roomDropDown.appendChild(new Option(saveName, saveName))
}

const addClassOption = (className) => {
    const classDropDown = document.getElementById("class")
    classDropDown.appendChild(new Option(className, className))
}
if (getCookie("rooms")) {
    const rooms = JSON.parse(getCookie("rooms"))
    Object.keys(rooms).forEach(async (name) => {
        addRoomOption(name)
    })
}
if (getCookie("classes")) {
    const classes = JSON.parse(getCookie("classes"))
    Object.keys(classes).forEach(async (name) => {
        addClassOption(name)
    })
}

const addSeatingLoadButton = (saveName) => {
    const savesContainer = document.getElementById("saves-dropdown")
    const loadButton = document.createElement("button")
    loadButton.classList.add("saves-dropdown-button")
    loadButton.classList.add("saves-dropdown-content")
    loadButton.innerHTML = saveName 
    savesContainer.appendChild(loadButton)
    loadButton.addEventListener("click", function() {
        const room = JSON.parse(getCookie("seatings"))[saveName]["room"]
        const className = JSON.parse(getCookie("seatings"))[saveName]["class"]
        document.getElementById("room").value = room
        document.getElementById("class").value = className
        document.getElementById("seating-name").value = saveName
        document.getElementById("seating-name").readOnly = true
        rows = JSON.parse(getCookie("rooms"))[room]["layout"]["rows"]
        columns = JSON.parse(getCookie("rooms"))[room]["layout"]["columns"]
        drawingArea.style.gridTemplateColumns = `repeat(${columns}, 1fr)`
        drawingArea.style.gridTemplateRows = `repeat(${rows}, 1fr)`
        grid = JSON.parse(getCookie("seatings"))[saveName]["grid"]
        console.log(grid)
        fillGrid(JSON.parse(getCookie("classes"))[className])
    })
}

let seatingNames = ""
try {
    if (getCookie("seatings") != "") {
        seatingNames = JSON.parse(getCookie("seatings"))
    }
} catch (error) {}
if (getCookie("seatings") != "") {
    seatingNames = JSON.parse(getCookie("seatings"))
}
if (seatingNames && typeof seatingNames === "object" && Object.keys(seatingNames).length > 0){
    seatingNames = Object.keys(seatingNames)
    seatingNames.forEach(async (name) => {
        addSeatingLoadButton(name)
    })
}

const showSaves = () =>  {
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

document.getElementById("create-new-seating").addEventListener("click", () => {
    document.querySelectorAll("#create-seating-form > *").forEach((element) => {
        element.disabled = false
    })
    document.getElementById("seating-name").focus()
})

document.getElementById("create-seating").addEventListener("click", (event) => {
    const seatingName = document.getElementById("seating-name").value
    const roomName = document.getElementById("room").value
    const className = document.getElementById("class").value
    if (!seatingName || !roomName || !className) {
        return
    }
    event.preventDefault()
    rows = JSON.parse(getCookie("rooms"))[roomName]["layout"]["rows"]
    columns = JSON.parse(getCookie("rooms"))[roomName]["layout"]["columns"]
    drawingArea.style.gridTemplateColumns = `repeat(${columns}, 1fr)`
    drawingArea.style.gridTemplateRows = `repeat(${rows}, 1fr)`
    grid = JSON.parse(getCookie("rooms"))[roomName]["grid"]
    console.log(grid[0][0][1])
    fillGrid(JSON.parse(getCookie("classes"))[className])
    console.log(grid[0][0][1])
    let seatings = {}
    try {
        if (getCookie("seatings") != "") {
            seatings = JSON.parse(getCookie("seatings"))
        }
    } catch (error) {}
    seatings[seatingName] = {"grid": grid,"room": roomName, "class": className}
    setCookie("seatings", JSON.stringify(seatings), 365)
    document.querySelectorAll(".saves-dropdown-button").forEach(element => {
        if (element.innerHTML == seatingName) {element.remove()}
    })
    addSeatingLoadButton(seatingName)
})

document.getElementById("save-button").addEventListener("click", () => {
    const seatingName = document.getElementById("seating-name").value
    const roomName = document.getElementById("room").value
    const className = document.getElementById("class").value
    if (!seatingName || !roomName || !className) {
        return
    }
    let seatings = {}
    try {
        if (getCookie("seatings") != "") {
            seatings = JSON.parse(getCookie("seatings"))
        }
    } catch (error) {}
    seatings[seatingName] = {"grid": grid,"room": roomName, "class": className}
    setCookie("seatings", JSON.stringify(seatings), 365)
    document.querySelectorAll(".saves-dropdown-button").forEach(element => {
        if (element.innerHTML == seatingName) {element.remove()}
    })
    addSeatingLoadButton(seatingName)
})