import 'dotenv/config'
import express from 'express'
import sql from 'mssql'

const app = express()
app.use(express.json())

const PORT = process.env.PORT

const dbConfig = {
    user: process.env.AZURE_SQL_USERNAME,
    password: process.env.AZURE_SQL_PASSWORD,
    server: process.env.AZURE_SQL_SERVER,
    database: process.env.AZURE_SQL_DATABASE,
    port: parseInt(process.env.AZURE_SQL_PORT),
    options: {
        encrypt: true, 
        trustServerCertificate: true 
    }
}

app.get('/', (req, res) => {
    res.send('Halo Dek')
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body
    try {
        await sql.connect(dbConfig)
        const result = await sql.query`SELECT * FROM users WHERE username = ${username} AND password = ${password}`
        console.log(result)
        if (result.recordset.length > 0) {
            res.json({
                message: 'Login successful',
                data: result.recordset[0],
            })
        } else {
            res.status(401).json({ message: 'Invalid credentials' })
        }
    } catch (err) {
        res.status(500).json({ message: 'Database error', error: err.message })
    }
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body
    try {
        await sql.connect(dbConfig)
        await sql.query`INSERT INTO users (username, password) VALUES (${username}, ${password})`
        res.json({
            message: 'Register successful',
            data: { username, password },
        })
    } catch (err) {
        res.status(500).json({ message: 'Database error', error: err.message })
    }
})

app.get('/users', async (req, res) => {
    try {
        await sql.connect(dbConfig)
        const result = await sql.query`SELECT * FROM users`
        res.json({
            message: 'Users retrieved successfully',
            data: result.recordset,
        })
    } catch (err) {
        res.status(500).json({ message: 'Database error', error: err.message })
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})