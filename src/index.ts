import express, { Request, Response } from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.get("/search/local/:ceps", async (req: Request, res: Response) => {
  const { ceps } = req.params;
  const cepArray = ceps.split(",");

  try {
    const requests = cepArray.map((cep) =>
      axios.get(`https://viacep.com.br/ws/${cep}/json/`)
    );
    const responses = await Promise.all(requests);

    const data = responses.map((response) => {
      const {
        cep,
        logradouro,
        complemento,
        bairro,
        localidade,
        uf,
        ibge,
        gia,
        ddd,
        siafi,
      } = response.data;
      return {
        cep,
        label: `${logradouro}, ${localidade}`,
        logradouro,
        complemento,
        bairro,
        localidade,
        uf,
        ibge,
        gia,
        ddd,
        siafi,
      };
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data from ViaCEP" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
