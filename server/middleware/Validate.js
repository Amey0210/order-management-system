import { z } from 'zod';

export const orderSchema = z.object({
  customerName: z.string().min(2, "Name is too short"),
  address: z.string().min(5, "Address is too short"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  items: z.array(z.object({
    name: z.string(),
    quantity: z.number().min(1),
    price: z.number().positive()
  })).min(1, "Cart cannot be empty"),
  totalPrice: z.number().nonnegative()
});

export const validateOrder = (req, res, next) => {
  try {
    orderSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ message: "Validation Failed", errors: error.errors });
  }
};