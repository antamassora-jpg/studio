'use server';
/**
 * @fileOverview An AI assistant to refine text for student card terms, ensuring clarity, conciseness, and professional phrasing.
 *
 * - refineCardTerms - A function that handles the text refinement process.
 * - RefineCardTermsInput - The input type for the refineCardTerms function.
 * - RefineCardTermsOutput - The return type for the refineCardTerms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineCardTermsInputSchema = z.object({
  rawTermsText: z
    .string()
    .describe("The original text for the 'Ketentuan Pengguna Kartu' (Card Usage Terms)."),
});
export type RefineCardTermsInput = z.infer<typeof RefineCardTermsInputSchema>;

const RefineCardTermsOutputSchema = z.object({
  refinedTermsText: z
    .string()
    .describe(
      'The refined version of the card usage terms, improved for clarity, conciseness, and professional tone.'
    ),
});
export type RefineCardTermsOutput = z.infer<typeof RefineCardTermsOutputSchema>;

export async function refineCardTerms(input: RefineCardTermsInput): Promise<RefineCardTermsOutput> {
  return refineCardTermsFlow(input);
}

const refineCardTermsPrompt = ai.definePrompt({
  name: 'refineCardTermsPrompt',
  input: {schema: RefineCardTermsInputSchema},
  output: {schema: RefineCardTermsOutputSchema},
  prompt: `You are an expert editor for educational and administrative texts. Your task is to refine the provided 'Ketentuan Pengguna Kartu' (Card Usage Terms) for a student card. Focus on making the text:

1.  **Clear**: Easy for students and parents to understand.
2.  **Concise**: Remove any unnecessary words or phrases.
3.  **Professional**: Maintain a formal and appropriate tone for a school document.

Ensure the core message and rules remain intact. Provide only the refined text.

Original Terms:
---
{{{rawTermsText}}}
---

Refined Terms:`,
});

const refineCardTermsFlow = ai.defineFlow(
  {
    name: 'refineCardTermsFlow',
    inputSchema: RefineCardTermsInputSchema,
    outputSchema: RefineCardTermsOutputSchema,
  },
  async input => {
    const {output} = await refineCardTermsPrompt(input);
    return output!;
  }
);
