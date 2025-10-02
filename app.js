import 'dotenv/config'
import express from 'express'
const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Halo Dek')
})

app.post('/:message', (req, res) => {
    const { message } = req.params
    res.json({
        status: 'success',
        data: `halo dek: ${message}`,
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})