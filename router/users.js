const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');

// Chamando os controllers 
//const animalsController = require('../controllers/animals-controllers');

router.post('/cadastro', (req, res, next) => {
    mysql.getConnection((err, conn) => {
        if (err) {
            return res.status(500).send({
                error: error
            })
        }
        conn.query('SELECT * FROM users WHERE email = ?', [req.body.email], (error, results) => {
            if (error) {
                return res.status(500).send({
                    error: error
                })
            }
            if (results.length > 0) {
                res.status(409).send({
                    mensagem: 'Usuário já cadastrado'
                })
            } else {
                bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                    if (errBcrypt) {
                        return res.status(500).send({
                            error: errBcrypt
                        })
                    }
                    conn.query(
                        `INSERT INTO users (nome_user, email, senha, estado, cep, cidade, rua, bairro, numero, telefone) VALUES (?,?,?,?,?,?,?,?,?,?)`,
                        [
                            req.body.nome_user,
                            req.body.email,
                            hash,
                            req.body.estado,
                            req.body.cep,
                            req.body.cidade,
                            req.body.rua,
                            req.body.bairro,
                            req.body.numero,
                            req.body.telefone
                        ],
                        (error, results) => {
                            conn.release();
                            if (error) {
                                return res.status(500).send({
                                    error: error
                                })
                            }
                            response = {
                                mensagem: 'Usuário criado com sucesso',
                                usuarioCriado: {
                                    id_usuario: results.insertId,
                                    email: req.body.email,
                                    estado: req.body.estado,
                                    cep: req.body.cep,
                                    cidade: req.body.cidade,
                                    rua: req.body.rua,
                                    bairro: req.body.bairro,
                                    numero: req.body.numero,
                                    telefone: req.body.telefone
                                }
                            }
                            return res.status(201).send(response);
                        })
                });
            }
        })

    });
})

module.exports = router;