import { MercadoPagoConfig, Payment } from "mercadopago";

const Client = new MercadoPagoConfig(
    {
        accessToken: process.env.accessToken,
        options : {timeout: 5000}
    }
)

const payment = new Payment(Client)
