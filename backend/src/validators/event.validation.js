import Joi from "joi";

export const createEventSchema = Joi.object({
    title: Joi.string().trim().required(),
    description: Joi.string().required(),
    category: Joi.string()
        .valid("Music", "Tech", "Workshop", "Sports", "Other")
        .default("Other"),
    date: Joi.date().greater("now").required().messages({
        "date.greater": "Event date must be in the future",
    }),
    location: Joi.string().required(),
    ticketPrice: Joi.number().min(0).required(),
    totalTickets: Joi.number().min(1).required(),
});

export const bookEventSchema = Joi.object({
    requestedTickets: Joi.number().min(1).required(),
});