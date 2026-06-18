import { initCron } from "../lib/cron";
import { User } from "../models/User";

export const startEmailAutomation = async () => {
    try {
        const users = await User.find();
        console.log(`Usuarios encontrados: ${users.length}`)

        users.forEach((user) => {
                    initCron({
                        title: "Reportes",
                        toName: user.name,
                        content: `<p>Hola ${user.name}, este es tu reporte automático.</p>`,
                        fromEmail: process.env.EMAIL_USER || "",
                        toEmail: user.email,
                        status: "ACTIVE",
                        footer: "Generado automáticamente"
                    });
                });
    } catch (error) {
        console.error("Error en el servicio de envio de correos.", error)
    }
}