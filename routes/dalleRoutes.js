import express from 'express';
import * as dotenv from 'dotenv';

import fetch from 'node-fetch';

dotenv.config();

const router = express.Router();

router.route('/').get((req, res) => {
  res.send('Hello from DALL-E!');
});

router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
      {
        headers: { Authorization: process.env.HUGGINGFACE_API_KEY },
        method: "POST",
        body: JSON.stringify({ inputs: prompt}),
      }
    ); 

    const buffer = await response.buffer();
    const image = buffer.toString('base64');

    res.status(200).json({ photo: image });
  } catch (error) {
    console.error(error);
    res.status(500).send(error?.response.data.error.message);
  }
});

export default router;