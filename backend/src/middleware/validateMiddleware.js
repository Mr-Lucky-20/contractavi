import { ZodError } from 'zod';

export const validate = (schema, source = 'body') => {
  return async (req, res, next) => {
    try {
      const data = source === 'query' ? req.query : source === 'params' ? req.params : req.body;
      const parsed = await schema.parseAsync(data);
      if (source === 'query') req.query = parsed;
      else if (source === 'params') req.params = parsed;
      else req.body = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const issues = err.issues.map((i) => ({
          field: i.path.join('.'),
          message: i.message,
        }));
        return res.status(400).json({
          success: false,
          errors: issues,
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Invalid input',
      });
    }
  };
};
