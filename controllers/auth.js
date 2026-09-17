
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST, 
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

exports.login = (req, res1)=>{
    const { email, senha } = req.body   

    db.query('SELECT * FROM users WHERE email = ?', [email], async (error, data)=>{
        if (error) throw error;
        
        if (data.length <= 0){
            console.log("E-mail errado ou não cadastrado")
            return res1.render('login', {
                message: "E-mail errado ou não cadastrado"
            })
        }

        const passwordMatch = await bcrypt.compare(senha, data[0].password)
        if (passwordMatch) {

            const name = data[0].name;
            const id = data[0].id;
            const email = data[0].email;
            const token = jwt.sign({id, name, email}, process.env.JWT_SECRET, {expiresIn: '7d'});

            res1.cookie('token', token, {httpOnly: true});

            return res1.render('index', {
                message: `bem vindo, '${name}'`
            })
        } else {
            return res1.render('login', {
                message: 'senha errada'
            })
        }
    })
}
function containsNumber(str) {
    for (let char of str) {
        if (char >= '0' && char <= '9') {
            return true;
        }
    }
    return false;
}

function passwordValidation(senha) {

    if (senha.length < 8) return [false, 'precisa-se colocar uma senha igual ou maior que 8'];
    if (senha.length > 32) return [false,'senha precisa ter menos de 32 caracteres']
    if (!containsNumber(senha)) return [false, 'senha precisa conter pelo menos um numero'];
    if(senha.toUpperCase() == senha) return [false, 'senha precisa conter pelo menos um minusculo'];
    if(senha.toLowerCase() == senha) return [false, 'senha precisa conter pelo menos uma letra em maiusculo'];

    return [true, '']
}

exports.register = (req, res)=>{
    const { nome, email, senha } = req.body

    if (nome.length <= 0 ){
        return res.render('register', {
            message: 'Precisa colocar um nome'
        })
    } else if (email.length <= 0 ){
        return res.render('register', {
            message: 'precisa-se colocar um email'
        })
    } 

    const [ret, warn] = passwordValidation(senha)
    if(!ret){
        return res.render('register', {
            message: warn
        })
    }

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, data)=>{
        if (error) throw error;
        
        if (data.length > 0){
            return res.render('register', {
                message: 'email já está em uso'
            })
        }
            
        let hashedPassword = await bcrypt.hash(senha, 10)

        db.query('INSERT INTO users SET ?', {name: nome, email: email, password: hashedPassword}, (err, data2)=>{
            if (err){ 
                console.log(err);
                return res.render('register', {
                    message: 'erro: '+err
                })
            }
            else{
                const id = data2.insertId

                const token = jwt.sign({id, nome, email}, process.env.JWT_SECRET, {expiresIn: '7d'});

                res.cookie('token', token, {httpOnly: true});

                return res.render('index',{
                    message: 'Usuario registrado com sucesso'
                })
            }
        } )
    })
}

exports.getProducts = (req, res)=>{
    let order = 'SELECT * FROM products ';
    let CurrentPage = 0;

    const Itemlimit = 10;

    if (req.body != undefined){
        const {nome, price, limit, page} = req.body

        if (nome !=''){
            order += `WHERE name='${nome}'`
            if (price != '') order += ` AND price='${price}'`
        }
        else if (price != ''){
            order += `WHERE price='${price}'`
        }
        if (limit != '') Itemlimit = limit

        if(page>0) CurrentPage = page;
    }
    
    order += `ORDER BY id LIMIT ${Itemlimit}`
    order += ` OFFSET ${CurrentPage*Itemlimit}`

    console.log(order);
    db.query(order, (err, data)=>{
        if (err) throw err;

        res.render('productList', {pagina: CurrentPage,produtos: data})
    })
}

exports.productCreate = (req, res)=>{
    const { nome, price } = req.body 
    
    if (nome.length <= 0 ){
        return res.render('products', {
            message: 'Precisa colocar um nome'
        })
    } else if (price <= 0 ){
        return res.render('products', {
            message: 'precisa-se colocar um preço maior que 0'
        })
    }

    const order = `INSERT INTO products (name, price) VALUES ('${nome}', ${price})`
    db.query(order, (err, data)=>{
        if (err){ 
            console.log(err);
            return res.render('products', {
                message: 'erro: '+err
            })
        }
        else{

            console.log(data);
            return res.redirect('/productList')
        }
    } )
}

exports.removeProduct = (req, res)=>{
    let order = 'DELETE FROM products WHERE id ='+req.params.id;

    db.query(order, (err, data)=>{
        if (err) throw err;
    })

    return res.redirect('/productList');
}
exports.setUpdate = (req, res)=>{
    let id = req.params.id

    let findIDorder = 'SELECT * FROM products WHERE id ='+id;

    db.query(findIDorder, (err, data)=>{
        if (err) throw err;

        return res.render('productsEdit', {produto:data[0]})
    })
}
exports.updateProduct = (req, res)=>{
    const { id, nome, price } = req.body 
    
    let order = `UPDATE products SET name='${nome}', price=${price} WHERE id=${id}`

    db.query(order, (err, data)=>{
        if (err) throw err;

        return res.redirect('/productList'); 
    })

}