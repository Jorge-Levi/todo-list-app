const express = require('express');
const { check, validationResult } = require('express-validator');
const { getTasks, createTask, updateTask, deleteTask, getTaskById } = require('../controllers/taskController');

const router = express.Router();

// Ruta para obtener todas las tareas
router.get('/', getTasks);

// Ruta para obtener una tarea específica
router.get('/:id', getTaskById);  // Nueva ruta

// Ruta para crear una nueva tarea con validación
router.post(
  '/',
  [
    check('title', 'Title is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  createTask
);

// Ruta para actualizar una tarea
router.put('/:id', updateTask);

// Ruta para eliminar una tarea
router.delete('/:id', deleteTask);

module.exports = router;
