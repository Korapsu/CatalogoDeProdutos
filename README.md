# NodejsProject

Para executar precisa baixar as seguintes dependencias:
- bcrypt
- mysql
- bootstrap
- cookie-parser
- jsonwebtoken
- dotenv
- express
- hbs

no ".env" precisa usar as seguintes variáveis:
- DATABASE 
- DATABASE_HOST 
- DATABASE_USER
- JWT_SECRET 
- DATABASE_PASSWORD 

No banco de dados:
- users
    - id    : INT AUTO_INCREMENT
    - email : VARCHAR UNIQUE
    - password : VARCHAR
    - name : VARCHAR
- products 
    - id : INT 
    - name: VARCHAR 
    - price: FLOAT