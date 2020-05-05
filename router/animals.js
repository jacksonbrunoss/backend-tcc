const express = require('express');
const router = express.Router();

// Chamando os controllers 
//const animalsController = require('../controllers/animals-controllers');

router.get('/',
    (req, res, next) => {
        res.status(200).send({
            mensagem: "Usando o GET no route animals"
        })
    }
);

router.get('/:id_animals',
    (req, res, next) => {
        const id = req.params.id_animals
        res.status(200).send({
            mensagem: "Usando o GET com paramentro ID no route animals",
            id: id
        })
    }
);

router.post('/',
    (req, res, next) => {
        const animals = {
            nome: req.body.nome,
            descricao: req.body.descricao,
            especie: req.body.especie,
            sexo: req.body.sexo,
            tamanho: req.body.tamanho,
            observacoes: req.body.observacoes,
            id_users: req.body.id_users
        }
        res.status(200).send({
            mensagem: "Usando o POST no route animals",
            animals: animals
        })
    }
);

router.patch('/',
    (req, res, next) => {
        res.status(200).send({
            mensagem: "Usando o PATCH no route animals"
        })
    }
);

router.delete('/',
    (req, res, next) => {
        res.status(200).send({
            mensagem: "Usando o DELETE no route animals"
        })
    }
);

module.exports = router;