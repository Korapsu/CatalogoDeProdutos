const express = require('express')
const authController = require('../controllers/auth')

const router = express.Router()

const app = express()
app.use(express.urlencoded({extended:false}))
app.use(express.json())

router.get('/', (req, res)=>{
    res.render('index')
})

router.get('/index', (req, res)=>{
    res.render('index')
})
router.get('/register', (req, res)=>{
    res.render('register')
})
router.get('/login', (req, res)=>{
    res.render('login')
})

router.get('/CreateProducts', (req, res)=>{
    res.render('products')
})

router.get('/ProductList', authController.getProducts)

router.get('/update/:id', authController.setUpdate)

router.get('/remove/:id', authController.removeProduct)


module.exports = router;