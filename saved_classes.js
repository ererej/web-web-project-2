const loadButtonsContainer = document.getElementById("saved-classes")


const addClassLoadButton = (saveName) => {
    const savedClassesContainer = document.getElementById("saved-classes-container")
    const classButton = document.createElement("button")
    classButton.classList.add("buttons")
    classButton.innerHTML = saveName 
    savedClassesContainer.appendChild(classButton)
    classButton.addEventListener("click", function() {
        document.getElementById("students").value = JSON.parse(getCookie("classes"))[saveName].join(",")
        document.getElementById("class-name").value = saveName
        document.getElementById("class-name").readOnly = true
        document.getElementById("delete-class").style.display = "inline-block"
    })
}

let classNames = ""
try {
    if (getCookie("classes") != "") {
        classNames = JSON.parse(getCookie("classes"))
    }
} catch (error) {
    console.log("no saves")
}
if (getCookie("classes") != "") {
    classNames = JSON.parse(getCookie("classes"))
}
if (classNames && typeof classNames === "object" && Object.keys(classNames).length > 0){
    classNames = Object.keys(classNames)
    classNames.forEach(async (name) => {
        addClassLoadButton(name)
    })
}

const newClassButton = document.getElementById("new-class")
newClassButton.addEventListener("click", () => {
    const formClassName = document.getElementById("class-name")
    formClassName.value = ""
    formClassName.readOnly = false
    formClassName.focus();
    document.getElementById("students").value = ""
    document.getElementById("delete-class").style.display = "none"
})

const deleteClassButton = document.getElementById("delete-class")
deleteClassButton.addEventListener("click", () => {
    const className = document.getElementById("class-name").value
    let savedClasses = JSON.parse(getCookie("classes"))
    delete savedClasses[className]
    setCookie("classes", JSON.stringify(savedClasses), 365)
    document.getElementById("students").value = ""
    document.getElementById("class-name").value = ""
    document.getElementById("class-name").readOnly = false
    location.reload()
    document.querySelector(`button[innerHTML="${className}"]`).remove();
})

document.getElementById("create-class-form").addEventListener("submit", function (e) {
    e.preventDefault();
  
    var formData = new FormData(this); // Fix: Use 'this' instead of 'form'
    // output as an object
    let savedClasses = {}
    if (getCookie("classes") != "") {
        savedClasses = JSON.parse(getCookie("classes"))
    }
    if (!savedClasses[Object.fromEntries(formData)["class-name"]]) {
        addClassLoadButton(Object.fromEntries(formData)["class-name"])
    }
    savedClasses[Object.fromEntries(formData)["class-name"]] = Object.fromEntries(formData).students.split(/[\n,]+/).map(name => name.trim());
    setCookie("classes", JSON.stringify(savedClasses), 365)
    console.log(JSON.parse(getCookie("classes")))
    const className = Object.fromEntries(formData)["class-name"];
});