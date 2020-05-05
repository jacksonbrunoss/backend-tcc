const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, call) {
    call(null, './uploads/');
  },
  filename: function (req, file, call) {
    call(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, call) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    call(null, true);
  } else {
    call(null, false);
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

// Chamando os controllers
//const animalsController = require('../controllers/animals-controllers');

router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error
      });
    }
    conn.query(
      `SELECT animals.id_animal,
                       animals.nome,
                       animals.descricao,
                       animals.especie,
                       animals.sexo,
                       animals.tamanho,
                       animals.observacoes,
                       animals.estado,
                       animals.cidade,
                       animals.imagem_animal,
                       users.id_user,
                       users.nome_user,
                       users.email,
                       users.estado,
                       users.cep,
                       users.cidade,
                       users.rua,
                       users.bairro,
                       users.numero,
                       users.telefone  
                  FROM animals 
                  INNER JOIN users
                     ON users.id_user = animals.id_user;`,
      (error, result, fields) => {
        if (error) {
          return res.status(500).send({
            error: error
          });
        }
        /* Melhorando a saida de dados */
        const response = {
          total: result.length,
          animals: result.map((animal) => {
            return {
              id_animal: animal.id_animal,
              nome: animal.nome,
              descricao: animal.descricao,
              especie: animal.especie,
              sexo: animal.sexo,
              tamanho: animal.tamanho,
              observacoes: animal.observacoes,
              estado: animal.estado,
              cidade: animal.cidade,
              id_user: animal.id_user,
              imagem_animal: animal.imagem_animal,
              usuario: {
                id_user: animal.id_user,
                nome: animal.nome_user,
                email: animal.email,
                estado: animal.estado,
                cep: animal.cep,
                cidade: animal.cidade,
                rua: animal.rua,
                bairro: animal.bairro,
                numero: animal.numero,
                telefone: animal.telefone,
              },
              request: {
                tipo: "GET",
                descricao: "Mostrar um animal pelo ID 🙂.",
                url: `http://localhost/3030/animals/${animal.id_animal}`,
              },
            };
          }),
        };
        return res.status(200).send(response);
      }
    );
  });
});

router.get("/:id_animal", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error
      });
    }
    conn.query(
      `SELECT * FROM animals WHERE id_animal = ?;`,
      [req.params.id_animal],
      (error, result, fields) => {
        if (error) {
          return res.status(500).send({
            error: error
          });
        }
        if (result.length == 0) {
          return res.status(404).send({
            mensagem: "Não foi encontrado animal com este ID",
          });
        }
        const response = {
          animal: {
            id_animal: result[0].id_animal,
            nome: result[0].nome,
            descricao: result[0].descricao,
            especie: result[0].especie,
            sexo: result[0].sexo,
            tamanho: result[0].tamanho,
            observacoes: result[0].observacoes,
            estado: result[0].estado,
            cidade: result[0].cidade,
            id_user: result[0].id_user,
            imagem_animal: result[0].imagem_animal,
            request: {
              tipo: "GET",
              descricao: "Retorna todos os produtos",
              url: "http://localhost:3000/produtos",
            },
          },
        };

        return res.status(200).send(response);
      }
    );
  });
});

router.post("/", upload.single('image'), (req, res, next) => {
  mysql.getConnection((error, conn) => {
    conn.query(
      `INSERT INTO animals (nome, descricao, especie, sexo, tamanho, observacoes, estado, cidade, id_user, imagem_animal) 
                 VALUES (?,?,?,?,?,?,?,?,?,?)`,
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
        req.file.path,
      ],
      (error, result, field) => {
        conn.release();
        if (error) {
          res.status(500).send({
            error: error,
            response: null,
          });
        }
        const response = {
          mensagem: "Animal foi inserido com sucesso 😄.",
          animalCriado: {
            id_animal: result.id_animal,
            nome: req.body.nome,
            descricao: req.body.descricao,
            especie: req.body.especie,
            sexo: req.body.sexo,
            tamanho: req.body.tamanho,
            observacoes: req.body.observacoes,
            estado: req.body.estado,
            cidade: req.body.cidade,
            id_user: req.body.id_user,
            imagem_animal: req.file.path,
            request: {
              tipo: "GET",
              descricao: "Mostrar todos os animais.",
              url: `http://localhost/3030/animals`,
            },
          },
        };
        return res.status(201).send(response);
      }
    );
  });
});

router.patch("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error
      });
    }
    conn.query(
      `UPDATE animals SET nome = ?, descricao = ?, especie = ?, sexo = ?, tamanho = ?, observacoes = ?, estado = ?, cidade = ? WHERE id_animal = ?`,
      [
        req.body.nome,
        req.body.descricao,
        req.body.especie,
        req.body.sexo,
        req.body.tamanho,
        req.body.observacoes,
        req.body.estado,
        req.body.cidade,
        req.body.id_animal,
      ],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error
          });
        }
        const response = {
          mensagem: "Animal atualizado com sucesso",
          animalAtualizado: {
            id_animal: req.body.id_animal,
            nome: req.body.nome,
            descricao: req.body.descricao,
            especie: req.body.especie,
            sexo: req.body.sexo,
            tamanho: req.body.tamanho,
            observacoes: req.body.observacoes,
            estado: req.body.estado,
            cidade: req.body.cidade,
            request: {
              tipo: "GET",
              descricao: "Retorna os detalhes de um produto específico",
              url: "http://localhost:3000/produtos/" + req.body.id_animal,
            },
          },
        };
        return res.status(202).send(response);
      }
    );
  });
});

router.delete("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({
        error: error
      });
    }
    conn.query(
      `DELETE FROM animals WHERE id_animal = ?`,
      [req.body.id_animal],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error
          });
        }
        const response = {
          mensagem: "Animal removido com sucesso",
          request: {
            tipo: "POST",
            descricao: "Insere um animal",
            url: "http://localhost:3000/animals",
            body: {
              nome: "String",
              descricao: "String",
              especie: "String",
              sexo: "String",
              tamanho: "String",
              observacoes: "String",
              estado: "String",
              cidade: "String",
            },
          },
        };
        res.status(202).send(response);
      }
    );
  });
});

module.exports = router;