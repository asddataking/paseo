import Stripe from "stripe";

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export const PRICE_IDS = {
  consumerGold: process.env.STRIPE_PRICE_CONSUMER_GOLD ?? "",
  consumerBlack: process.env.STRIPE_PRICE_CONSUMER_BLACK ?? "",
  infraGold: process.env.STRIPE_PRICE_INFRA_GOLD ?? "",
  infraBlack: process.env.STRIPE_PRICE_INFRA_BLACK ?? "",
};
