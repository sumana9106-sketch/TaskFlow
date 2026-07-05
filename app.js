const inputTask = document.querySelector("#add-work");
const addTaskBtn = document.querySelector("#add-btn");
const taskList = document.querySelector("#task-list");
const form = document.querySelector(".input-area");
const emptyImg = document.querySelector("img");
const listSec = document.querySelector(".list-sec");
const totalTask = document.querySelector(".task-track .total");
const compTask = document.querySelector(".task-track .complete");
const progressText = document.querySelector(".progress");
const barProgress = document.querySelector(".bar");
let taskArray = [];

emptyImg.classList.remove("remove");

//task area size maintain

const taskArea=()=>{
    emptyImg.classList.toggle("remove",taskList.children.length>0);
    if(taskList.children.length > 0){
        listSec.style.width = "100%"  ;   
        emptyImg.classList.add("remove");      
    }
    else{
        listSec.style.width = "50%" ;
        emptyImg.classList.remove("remove");
    };
}

//bar and status update and animation maintain

const statusUpdate=()=>{
    const total = document.querySelectorAll(".checkbox").length;
    const complete = document.querySelectorAll(".checkbox:checked").length;
    totalTask.textContent = total;
    compTask.textContent = complete;

    let progress = 0;
        if(total > 0){
            progress = (complete/total)*100;
        }
    progressText.textContent = `${Math.round(progress)}% Completed`;
    barProgress.style.width = `${Math.round(progress)}%`;

    if(total > 0 && total === complete){
        const count = 200,
        defaults = { origin: { y: .7 } };

        function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, { particleCount: Math.floor(count * particleRatio) }));
        }
        fire(.25, {
        spread: 26,
        startVelocity: 55
        });
        fire(.2, { spread: 60 });
        fire(.35, {
        spread: 100,
        decay: .91,
        scalar: .8
        });
        fire(.1, {
        spread: 120,
        startVelocity: 25,
        decay: .92,
        scalar: 1.2
        });
        fire(.1, {
        spread: 120,
        startVelocity: 45
        });
    }
}

// main section task adding , array making

const addTask =(event)=>{
    event.preventDefault();
    const task = inputTask.value.trim();
    if(!task){
        return;
    }

    const newTask = {
        text : task,
        completed:false,
    };
    taskArray.push(newTask);
    saveTask();
    const li = createTaskElement(newTask);
    taskList.appendChild(li);
    inputTask.value = "";
    emptyImg.classList.add("remove");
    taskArea();
    statusUpdate();
}
// new task creation part

const createTaskElement = (newTask)=>{
    const li = document.createElement("li");
    li.innerHTML = `<input type="checkbox" class=     "checkbox">
                    <span>${newTask.text}</span>
                    <div class="btn-sec">
                        <button class="delete"><i class="fa-solid fa-trash"></i></button>
                    </div>`;
    
    // checkbox operation                

    const checkbox = li.querySelector(".checkbox");

    checkbox.checked = newTask.completed;

    checkbox.addEventListener("change",()=>{
        newTask.completed = checkbox.checked;
        statusUpdate();
        saveTask();
    })

    // delete button

    const deleteBtn = li.querySelector(".delete");
    deleteBtn.addEventListener("click",()=>{
    const index = taskArray.indexOf(newTask);
    taskArray.splice(index,1);
    console.log("Before:", taskList.children.length);
    li.remove();
    console.log("After:", taskList.children.length);
    taskArea();
    statusUpdate();
    saveTask();
    })

    return li;
}


//task storage operation

const saveTask=()=>{
    localStorage.setItem("tasks",JSON.stringify(taskArray));
};
const loadTask =()=>{
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks === null){
        taskArray =[];
    }else{
        taskArray = JSON.parse(savedTasks);
        taskArray.forEach(task => {
            const li = createTaskElement(task);
            taskList.appendChild(li);
        });
    }
    if(taskArray.length > 0){
        emptyImg.classList.add("remove");
    }
}



form.addEventListener("submit", addTask);
loadTask();
statusUpdate();
taskArea();

