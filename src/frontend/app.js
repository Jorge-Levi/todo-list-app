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
  try {
    await addTask(task);

    // Resetear el formulario
    document.getElementById("task-form").reset();

    // Cargar las tareas nuevamente para mostrar la tarea agregada
    loadTasks();
  } catch (error) {
    console.error("Error adding task:", error);
    alert("There was a problem adding the task. Please try again.");
  }
});

// Función para cargar las tareas desde el backend
async function loadTasks() {
  try {
    const response = await fetch("http://localhost:5000/api/tasks");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();

    // Acceder a la propiedad data en caso de que sea un objeto con { success: true, data: [...] }
    const tasks = result.data || result; // result.data si existe, de lo contrario usa result directamente

    displayTasks(tasks);
  } catch (error) {
    console.error("Error loading tasks:", error);
    alert("There was a problem loading tasks. Please try again.");
  }
}

// Función para agregar una nueva tarea al backend
async function addTask(task) {
  const response = await fetch("http://localhost:5000/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error("Failed to add task");
  }
}

// Función para eliminar una tarea del backend
async function deleteTask(taskId) {
  try {
    const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete task");
    }

    loadTasks();
  } catch (error) {
    console.error("Error deleting task:", error);
    alert("There was a problem deleting the task. Please try again.");
  }
}

// Función para cambiar el estado de una tarea (completada/incompleta)
async function toggleTaskCompletion(taskId, completed) {
  try {
    const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed }),
    });

    if (!response.ok) {
      throw new Error("Failed to update task");
    }

    loadTasks();
  } catch (error) {
    console.error("Error updating task:", error);
    alert("There was a problem updating the task. Please try again.");
  }
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
        <button class="edit-btn" onclick="editTask('${task._id}')" aria-label="Edit Task">
          <i class="fas fa-edit"></i>
        </button>
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

// Función para capturar los datos de la tarea a editar y llenar el formulario con ellos
async function editTask(taskId) {
  try {
    const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`);
    
    if (!response.ok) {
      throw new Error("Task not found");
    }

    const result = await response.json();
    const task = result.data;  // Aquí usamos result.data

    // Llenar el formulario con los datos de la tarea
    document.getElementById("title").value = task.title;
    document.getElementById("description").value = task.description;
    document.getElementById("category").value = task.category;

    // Cambiar el botón de envío para guardar cambios en lugar de agregar una nueva tarea
    const submitButton = document.querySelector("#task-form button");
    submitButton.textContent = "Update Task";
    submitButton.onclick = function (e) {
      e.preventDefault();
      updateTask(taskId);
    };
  } catch (error) {
    console.error("Error loading task:", error);
    alert(`Error loading task: ${error.message}`);
  }
}

// Función para actualizar una tarea en el backend
async function updateTask(taskId) {
  const task = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    category: document.getElementById("category").value,
  };

  try {
    const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error("Failed to update task");
    }

    // Resetear el formulario
    document.getElementById("task-form").reset();

    // Cambiar el botón de envío a su estado original
    const submitButton = document.querySelector("#task-form button");
    submitButton.textContent = "Add Task";
    submitButton.onclick = function (e) {
      e.preventDefault();
      addTask(task);
    };

    // Recargar las tareas
    loadTasks();
  } catch (error) {
    console.error("Error updating task:", error);
    alert("There was a problem updating the task. Please try again.");
  }
}

// Cargar las tareas cuando se carga la página
loadTasks();
