const express = require('express')
const authController = require('../controllers/auth')
const router = express.Router()
const jwt = require('jsonwebtoken');

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/products', authenticateToken, authController.productCreate)
router.post('/update', authController.updateProduct)
router.post('/productList', authController.getProducts)

module.exports = router;

function authenticateToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "No token provided"
        });
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);

        req.user = user;

        next();
    } catch (error) {
        return res.status(403).json({
            message: `Invalid or expired token: '${error}'`
        });
    }
}

/*
- Criar produto somente com token válido
- Tentativa sem token (ou com token inválido) é rejeitada pela API
- Documentação da API
*/