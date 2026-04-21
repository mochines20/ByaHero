import OpenAI from 'openai';
import { z } from 'zod';
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const chatSchema = z.object({
    message: z.string().min(1),
    context: z.object({
        origin: z.string().optional(),
        destination: z.string().optional(),
        time: z.string().optional(),
    }).optional(),
});
export const chatWithAI = async (req, res) => {
    try {
        const { message, context } = chatSchema.parse(req.body);
        const systemPrompt = `You are ByaHero, an AI commute assistant for the Philippines. Help users plan their commutes in Filipino or English. Suggest the best routes, times, and fares for public transport like jeepney, MRT, LRT, bus. Prioritize cheapest or fastest based on user preference. Use real knowledge of Philippine routes. For fares, estimate based on typical costs (e.g., MRT ₱15-20 per station, jeepney ₱10-20). Include safety tips. Do not use Sakay.ph or Google Maps.`;
        const userPrompt = `User: ${message}${context ? `\nContext: From ${context.origin} to ${context.destination} at ${context.time}` : ''}`;
        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            max_tokens: 500,
        });
        const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
        res.json({ response });
    }
    catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Failed to process chat' });
    }
};
