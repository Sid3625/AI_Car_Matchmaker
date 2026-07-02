import { Request, Response } from 'express';
import { parseQueryToPreferences } from '../services/ai.service';
import { AIParseRequestSchema } from '../schemas/match.schema';

/**
 * Handles POST /api/ai/parse
 */
export const parseUserQuery = async (req: Request, res: Response) => {
  try {
    const parsedBody = AIParseRequestSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        error: 'Validation Failed',
        details: parsedBody.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }

    const parsedPrefs = await parseQueryToPreferences(parsedBody.data.query);
    return res.json(parsedPrefs);
  } catch (error: any) {
    console.error('Error in parseUserQuery controller:', error);
    return res.status(500).json({
      error: error.message || 'An unexpected error occurred during AI parsing.'
    });
  }
};
