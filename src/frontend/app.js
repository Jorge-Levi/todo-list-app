// Capturar el formulario y manejar el evento de envío
document.getElementById("task-form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    // Crear un objeto tarea con los valores del formulario
    const task = {
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      category: document.getElementById("category").value,
      completed: false,
    };
  
    // Llamar a la función para agregar la tarea
    await addTask(task);
  
    // Resetear el formulario
    document.getElementById("task-form").reset();
  
    // Cargar las tareas nuevamente para mostrar la tarea agregada
    loadTasks();
  });
  
  // Función para cargar las tareas desde el backend
  async function loadTasks() {
    const response = await fetch("http://localhost:5000/api/tasks");
    const tasks = await response.json();
    displayTasks(tasks);
  }
  
  // Función para agregar una nueva tarea al backend
  async function addTask(task) {
    await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
  }
  
  // Función para eliminar una tarea del backend
  async function deleteTask(taskId) {
    await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
      method: "DELETE",
    });
    loadTasks();
  }
  
  // Función para cambiar el estado de una tarea (completada/incompleta)
  async function toggleTaskCompletion(taskId, completed) {
    await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed }),
    });
    loadTasks();
  }
  
  // Función para mostrar las tareas en la interfaz
  function displayTasks(tasks) {
    const tasksList = document.getElementById("tasks-list");
    tasksList.innerHTML = "";
  
    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.className = task.completed ? "completed" : "";
  
      li.innerHTML = `
        <div class="task-title">
          ${task.title} - ${task.category}
        </div>
        <div class="task-actions">
          <button class="delete-btn" onclick="deleteTask('${task._id}')" aria-label="Delete Task">
            <i class="fas fa-trash-alt"></i>
          </button>
          <button onclick="toggleTaskCompletion('${task._id}', ${!task.completed})" aria-label="${task.completed ? 'Mark Task as Incomplete' : 'Mark Task as Complete'}">
            <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
          </button>
        </div>
      `;
  
      tasksList.appendChild(li);
    });
  }
  
  // Cargar las tareas cuando se carga la página
  loadTasks();
  