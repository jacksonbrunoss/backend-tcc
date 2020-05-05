const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

// Chamando os controllers
//const animalsController = require('../controllers/animals-controllers');

router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(`SELECT * FROM animals;`, (error, result, fields) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      return res.status(200).send({ animals: result });
    });
  });
});

router.get("/:id_animal", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      `SELECT * FROM animals WHERE id_animal = ?;`,
      [req.params.id_animal],
      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        return res.status(200).send({ animal: result });
      }
    );
  });
});

router.post("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    conn.query(
      `INSERT INTO animals (nome, descricao, especie, sexo, tamanho, observacoes, estado, cidade, id_user) 
                 VALUES (?,?,?,?,?,?,?,?,?)`,
      [
        req.body.nome,
        req.body.descricao,
        req.body.especie,
        req.body.sexo,
        req.body.tamanho,
        req.body.observacoes,
        req.body.estado,
        req.body.cidade,
        req.body.id_user,
      ],
      (error, result, field) => {
        conn.release();
        if (error) {
          res.status(500).send({
            error: error,
            response: null,
          });
        }
        res.status(201).send({
          mensagem: "Novo animal foi inserido com sucesso 😄.",
          nome: result.nome,
        });
      }
    );
  });
});

router.patch("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      `UPDATE animals
                SET nome          = ?,
                    descricao     = ?,
                    especie       = ?,
                    sexo          = ?,
                    tamanho       = ?,
                    observacoes   = ?,
                    estado        = ?,
                    cidade        = ?,
                    id_user       = ?,
              WHERE id_animal     = ?`,
      [
        req.body.nome,
        req.body.descricao,
        req.body.especie,
        req.body.sexo,
        req.body.tamanho,
        req.body.observacoes,
        req.body.estado,
        req.body.cidade,
        req.body.id_user,
        req.body.id_animal,
      ],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error: error });
        }

        res.status(202).send({
          mensagem: "Produto alterado com sucesso 👌",
        });
      }
    );
  });
});

router.delete("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      `DELETE FROM animals WHERE id_animal = ?`,
      [req.body.id_animal],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error: error });
        }

        res.status(202).send({
          mensagem: "Produto removido com sucesso",
        });
      }
    );
  });
});

module.exports = router;
