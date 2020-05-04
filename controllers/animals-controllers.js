exports.getAnimals = (
    (req, res, next) => {
        res.status(200).send({
            mensagem: "Usando o GET no route animals"
        })
    }
);