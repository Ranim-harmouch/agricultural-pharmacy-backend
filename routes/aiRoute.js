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









// import express from 'express';
// import axios from 'axios';

// const router = express.Router();

// router.post('/', async (req, res) => {
//   const { message } = req.body;

//   try {
//     const response = await axios.post(
//       'https://api-inference.huggingface.co/models/deepseek-ai/deepseek-llm-7b-chat',
//       { inputs: message },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HF_TOKEN}`
//         }
//       }
//     );

//     const aiReply = response.data?.generated_text || "Sorry, I couldn't understand.";
//     res.json({ data: aiReply, message: "AI response", error: null });
//   } catch (error) {
//     console.error(error);
//     res.json({ data: null, message: "Failed to fetch AI response", error: error.message });
//   }
// });

// export default router;











import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// POST /api/ai/ask
router.post('/', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openchat/openchat-7b', // free model
        messages: [{ role: 'user', content: userMessage }],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5000', // required by OpenRouter
          'X-Title': 'agricultural-pharmacy-assistant' // optional: name your app
        },
      }
    );

    const aiReply = response.data.choices[0].message.content;
    res.json({ data: aiReply, message: 'AI response', error: null });
  } catch (error) {
    console.error('OpenRouter error:', error.response?.data || error.message);
    res.status(500).json({ data: null, message: '', error: 'AI request failed' });
  }
});

export default router;
