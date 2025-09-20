import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db'
import cors from 'cors'
import authRoutes from './routes/authRoute'
import taskRoutes from './routes/taskRoute'
import subscriptionRoutes from './routes/subscriptionRoute'



dotenv.config()

const app = express()
connectDB()

const port = process.env.PORT ?? 4000

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use("/api/tasks", taskRoutes)
app.use("/api/subscription",subscriptionRoutes)

app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.listen(port, () => console.log(`Server Listening on http://localhost:${port}`))