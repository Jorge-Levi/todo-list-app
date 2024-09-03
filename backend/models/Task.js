const mongoose = require('mongoose');

// Definir el esquema de la tarea
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: false,
  },
  completed: {
    type: Boolean,
    default: false,
  }
});

// Crear el modelo de la tarea basado en el esquema
const Task = mongoose.model('Task', taskSchema);

// Exportar el modelo para usarlo en otros archivos
module.exports = Task;
