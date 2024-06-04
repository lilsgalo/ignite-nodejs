import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
   {
      method: 'GET',
      path: buildRoutePath('/tasks'),
      handler: (req, res) => {
         const { search } = req.query
         const tasks = database.select('tasks', search ? {
            title: search,
            description: search
         } : null)
         return res.end(JSON.stringify(tasks))
      }
   },
   {
      method: 'POST',
      path: buildRoutePath('/tasks'),
      handler: (req, res) => {
         const { title, description } = req.body

         if(title == '' || description == ''){
            return res.writeHead(404).end(JSON.stringify({ message: 'Title or description cannot be empty' }))
         }

         const task = {
            id: randomUUID(),
            title,
            description,
            created_at: new Date(),
            updated_at: new Date(),
            completed_at: null
         }

         database.insert('tasks', task)
         return res.writeHead(201).end(JSON.stringify({ id: task.id }))
      }
   },
   {
      method: 'PUT',
      path: buildRoutePath('/tasks/:id'),
      handler: (req, res) => {
         const { id } = req.params
         const { title, description } = req.body
         
         const task = database.selectId('tasks', id)
         if(task == null){
            return res.writeHead(404).end(JSON.stringify({ message: 'Task not found' }))
         }

         if(title == '' || description == ''){
            return res.writeHead(404).end(JSON.stringify({ message: 'Title or description cannot be empty' }))
         }

         const updatedTask = {
            title,
            description,
            created_at: task.created_at,
            updated_at: new Date(),
            completed_at: task.completed_at
         }

         database.update('tasks', id, updatedTask)

         return res.writeHead(204).end()
      }
   },
   {
      method: 'PATCH',
      path: buildRoutePath('/tasks/:id/complete'),
      handler: (req, res) => {
         const { id } = req.params
         const task = database.selectId('tasks', id)
         if(task == null){
            return res.writeHead(404).end(JSON.stringify({ message: 'Task not found' }))
         }
         
         const completedTask = {
            title: task.title,
            description: task.description,
            created_at: task.created_at,
            updated_at: new Date(),
            completed_at: task.completed_at == null ? new Date() : null
         }

         database.update('tasks', id, completedTask)

         return res.writeHead(204).end()
      }
   },
   {
      method: 'DELETE',
      path: buildRoutePath('/tasks/:id'),
      handler: (req, res) => {
         const { id } = req.params
         const task = database.selectId('tasks', id)
         if(task == null){
            return res.writeHead(404).end(JSON.stringify({ message: 'Task not found' }))
         }

         database.delete('tasks', id)

         return res.writeHead(204).end()
      }
   }
]