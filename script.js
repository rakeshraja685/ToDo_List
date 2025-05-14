document.getElementById("add-btn").addEventListener("click", addTask);
window.addEventListener("load", loadTasks);

function showError(message) {
  const error = document.getElementById("error-message");
  error.textContent = message;
  setTimeout(() => error.textContent = "", 3000);
}

function addTask() {
  const taskInput = document.getElementById("new-task");
  const priorityInput = document.getElementById("priority");
  const dueDateInput = document.getElementById("due-date");
  const categoryInput = document.getElementById("category");
  const taskText = taskInput.value.trim();
  const priority = priorityInput.value;
  const dueDate = dueDateInput.value;
  const category = categoryInput.value.trim();

  if (taskText === "") {
    showError("Task cannot be empty.");
    return;
  }

  const task = {
    text: taskText,
    completed: false,
    priority,
    dueDate,
    category
  };

  saveTask(task);
  renderTask(task);

  taskInput.value = "";
  priorityInput.value = "normal";
  dueDateInput.value = "";
  categoryInput.value = "";
}

function renderTask(task) {
  const li = document.createElement("li");
  li.className = "task";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.onchange = () => {
    taskTextInput.classList.toggle("completed", checkbox.checked);
    task.completed = checkbox.checked;
    updateLocalStorage();
  };

  const taskTextInput = document.createElement("input");
  taskTextInput.type = "text";
  taskTextInput.value = task.text;
  taskTextInput.readOnly = true;
  if (task.completed) taskTextInput.classList.add("completed");

  const details = document.createElement("div");
  details.className = "task-details";
  details.textContent = `Priority: ${task.priority}, Due: ${task.dueDate || "N/A"}, Category: ${task.category || "N/A"}`;

  const actionsDiv = document.createElement("div");
  actionsDiv.className = "task-actions";

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className = "edit-btn";
  editBtn.onclick = () => {
    if (taskTextInput.readOnly) {
      taskTextInput.readOnly = false;
      editBtn.textContent = "Save";
    } else {
      taskTextInput.readOnly = true;
      task.text = taskTextInput.value;
      editBtn.textContent = "Edit";
      updateLocalStorage();
    }
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "delete-btn";
  deleteBtn.onclick = () => {
    li.remove();
    deleteTask(task.text);
  };

  actionsDiv.appendChild(editBtn);
  actionsDiv.appendChild(deleteBtn);

  li.appendChild(checkbox);
  li.appendChild(taskTextInput);
  li.appendChild(details);
  li.appendChild(actionsDiv);

  document.getElementById("task-list").appendChild(li);
}

function saveTask(task) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTask(taskText) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(t => t.text !== taskText);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateLocalStorage() {
  const listItems = document.querySelectorAll("#task-list .task");
  const tasks = Array.from(listItems).map(li => {
    const text = li.querySelector("input[type='text']").value;
    const completed = li.querySelector("input[type='checkbox']").checked;
    const details = li.querySelector(".task-details").textContent;
    const [, priority, , dueDate, , category] = details.match(/Priority: (.*?), Due: (.*?), Category: (.*)/);
    return { text, completed, priority, dueDate: dueDate === "N/A" ? "" : dueDate, category: category === "N/A" ? "" : category };
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(renderTask);
}
