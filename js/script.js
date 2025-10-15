

class Task {
    constructor({ text, date, done, id }) {
        // HINT This method is the constructor. In C++, this would be
        // the Task() method. The curly braces inside the constructor is // a JavaScript syntax that is called 'deconstruction'. This
        // means the constructor will ask for an object
        // (`{i: 'am', an: 'object'}`) with the parameters `text`,
        // `date`, `done`, and `id`. This will make it easier to
        // convert it from the local storage database we will set up.
        this.text = text
        this.date = date
        this.done = done
        this.id = id
    }
    toHTML() {
        // TODO: Fill out this method. It should return a string version
        // of this task, including an `<li>` tag and all of the
        // css classes you used to make it look pretty. It should
        // display the `text`, `date`, and `done` property of this
        // Task. It should also have two inline event handlers, which call the
        // update and delete function, with this Task's `id` as a
        // parameter.
        return `
        <li class='task' id="task-${this.id}">
        <!-- Fill me out -->
            <input type='checkbox' class="task-done" onclick="updateTask(${this.id})" ${this.done ? "checked" : ""}/>
            <label class="task-description ${this.done ? "task-completed" : ""}">${this.text} </label> 
            <span class="task-date">${this.prettyDate()}</span>
            <button class="task-delete material-icon" onclick="deleteTask(${this.id})">remove_circle</button>
            <span></span>
        </li>
        `
    }
    prettyDate() {
        // TODO: Fill out this method. It should return the date in our
        // locale's format, 'MM / DD / YYYY', instead of the
        // easily-sortable international standard, 'YYYY-MM-DD'.
        const [year, month, day] = this.date.split("-");
        return `${month}-${day}-${year}`;
    }
    toggle() {
        // TODO: Fill out this method. It should flip this Task's `done`
        // property from `true` to `false`, or from `false` to `true`.
        this.done = !this.done;
    }
}

let tasks = [
    new Task({
        text: "First task",
        done: false,
        date: "2020-02-10",
        id: Date.now() // makes a unique id
    })
]

//check for date sort
const date_toggle = document.getElementById("Sort-by-date");
date_toggle.addEventListener("change", readTasks);

//check for filter completed tasks
const filter_toggle = document.getElementById("Filter-completed-tasks");
filter_toggle.addEventListener("change", readTasks);


function updateStorage(newData) {
    // ... update the local storage
    let jsonString = JSON.stringify(newData);
    localStorage.setItem('database', jsonString);
    console.log("storage updated with " + jsonString)
}

function readStorage() {
    // ... read from the local storage
    const jsonString= localStorage.getItem('database');
    let result = JSON.parse(jsonString) || [];
    result = result.map(taskData => new Task(taskData))
    console.log("storage loaded successful")
    return result;
}

function createTask(event) {
    // TODO: Pull in form data from DOM
    event.preventDefault();
    const description = document.getElementById("new-task").value;
    const date = document.getElementById("new-date").value;
    // TODO: Format form data to Task Object
    const newTask = new Task({
        text: description,
        done: false,
        date: date,
        id: Date.now()
    });
    console.log(`added task ${description} with the due date ${date}`)
    // TODO: Pull in tasks from local storage and push new one to task list array
    tasks = readStorage();
    tasks.push(newTask)
    // TODO: Save it to local storage
    updateStorage(tasks);
    // TODO: Update DOM (Call readTasks())
    readTasks();
    // Hint - Look at the JavaScript code from lab 1B to see how to extract form data
}
function readTasks() {
    // TODO: Clear current tasks to not have duplicates
    const taskList = document.getElementById("tasklist");
    taskList.innerHTML = "";

    tasks = readStorage();
    let tasksToRender = [...tasks];
    if (date_toggle.checked) {
        tasksToRender.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    if (filter_toggle.checked) {
        tasksToRender = tasksToRender.filter(task => task.done === false)
    }
    // TODO: Parse tasks and Update DOM accordingly
    taskList.innerHTML = tasksToRender.map(task => task.toHTML()).join("");
    
}
function updateTask(id) {
    // TODO: Update the task in `tasks` array by flipping it's `done` value
    const task = tasks.find(task => task.id === id);
    task.toggle();
    // TODO: Save to local storage
    updateStorage(tasks);
    // TODO: Update DOM (Call readTasks())
    readTasks();
}
function deleteTask(id) {
    // TODO: Delete task from `tasks` array
    const index = tasks.findIndex(task => task.id === id);
    tasks.splice(index, 1);
    // TODO: Save to local storage
    updateStorage(tasks);
    // TODO: Make the DOM update
    readTasks();

}
