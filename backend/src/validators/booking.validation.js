import Joi from "joi";

export const bookTicketsSchema = Joi.object({
  requestedTickets: Joi.number().integer().min(1).required(),
});