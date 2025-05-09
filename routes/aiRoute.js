// import express from 'express';
// import faqData from '../ai/faqData.js'; // make sure faqData.js also uses export default

// const router = express.Router();

// router.post('/', (req, res) => {
//   const { question } = req.body;
//   const lowerQuestion = question.toLowerCase();

//   const match = faqData.find(faq => lowerQuestion.includes(faq.question));
  
//   if (match) {
//     res.json({ data: match.answer, message: "Answer found", error: null });
//   } else {
//     res.json({ data: "Sorry, I couldn't find an answer. Please contact us!", message: "No match", error: null });
//   }
// });

// export default router;








// import express from 'express';
// import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config(); // Load .env variables

// const router = express.Router();

// router.post('/', async (req, res) => {
//   const { question } = req.body;

//   try {
//     const response = await axios.post(
//       'https://api.openai.com/v1/chat/completions',
//       {
//         model: 'gpt-3.5-turbo',
//         messages: [
//           {
//             role: 'system',
//             content:
//               'You are an agricultural assistant providing helpful, practical answers about gardening, fertilizers, pesticides, soil, and plant care. Keep answers clear and friendly.',
//           },
//           {
//             role: 'user',
//             content: question,
//           },
//         ],
//         max_tokens: 150,
//         temperature: 0.7,
//       },
//       {
//         headers: {
//           'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     const aiAnswer = response.data.choices[0].message.content;
//     res.json({ data: aiAnswer, message: 'AI response', error: null });
//   } catch (error) {
//     console.error('AI Error:', error.response?.data || error.message);
//     res.status(500).json({
//       data: null,
//       message: 'Error communicating with AI',
//       error: error.message,
//     });
//   }
// });

// export default router;










import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/', async (req, res) => {
  const { question } = req.body;

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/bigscience/bloom',
      {
        inputs: `Answer this agriculture-related question clearly:\n\n${question}`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const aiAnswer = response.data?.[0]?.generated_text || "Sorry, couldn't generate an answer.";
    res.json({ data: aiAnswer, message: 'AI response', error: null });
  } catch (error) {
    console.error('Hugging Face AI Error:', error.response?.data || error.message);
    res.status(500).json({
      data: null,
      message: 'Error communicating with Hugging Face AI',
      error: error.message,
    });
  }
});

export default router;
