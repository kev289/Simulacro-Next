import cron from "node-cron";
import nodemailer from "nodemailer";

interface EmailTemplateProps {
    title: string;
    toName: string;
    content: string;
    fromEmail: string;
    toEmail: string;
    status: string;
    footer: string;
}

const getTerminalTemplate = (props: EmailTemplateProps): string => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: 'Courier New', Courier, monospace;
      background-color: #f4f4f5;
      color: #18181b;
    }

    .terminal {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e4e4e7;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .terminal-header {
      background-color: #e4e4e7;
      padding: 10px;
      border-bottom: 1px solid #d4d4d8;
    }

    .dot {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-right: 6px;
    }

    .dot-red { background-color: #ef4444; }
    .dot-yellow { background-color: #f59e0b; }
    .dot-green { background-color: #10b981; }

    .terminal-window {
      padding: 20px;
      line-height: 1.6;
    }

    .accent {
      color: #10b981;
      font-weight: bold;
    }

    .meta {
      color: #71717a;
    }

    .command {
      color: #2563eb;
      font-weight: bold;
    }

    .panel {
      background: #fafafa;
      border: 1px solid #e4e4e7;
      border-radius: 8px;
      padding: 14px;
      margin: 18px 0;
    }

    @media (prefers-color-scheme: dark) {
      body {
        background-color: #09090b !important;
        color: #f4f4f5 !important;
      }

      .terminal {
        background-color: #18181b !important;
        border-color: #27272a !important;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5) !important;
      }

      .terminal-header {
        background-color: #27272a !important;
        border-bottom-color: #3f3f46 !important;
      }

      .accent { color: #22c55e !important; }
      .meta { color: #a1a1aa !important; }
      .command { color: #60a5fa !important; }

      .panel {
        background: #09090b !important;
        border-color: #3f3f46 !important;
      }
    }
  </style>
</head>
<body>
  <div class="terminal">
    <div class="terminal-header">
      <span class="dot dot-red"></span>
      <span class="dot dot-yellow"></span>
      <span class="dot dot-green"></span>
      <span class="meta" style="font-size: 12px; margin-left: 10px;">~/kevin - zsh</span>
    </div>

    <div class="terminal-window">
      <p><span class="accent"># ${props.title}</span></p>
      <p>Hola, <span class="accent">${props.toName}</span>.</p>

      ${props.content}

      <hr style="border: 0; border-top: 1px solid #3f3f46; margin: 20px 0; opacity: 0.2;">

      <p style="margin: 0; font-size: 13px;">
        <span class="meta">FROM:</span> Kevin Uribe &lt;${props.fromEmail}&gt;<br>
        <span class="meta">TO:</span> ${props.toName} &lt;${props.toEmail}&gt;<br>
        <span class="meta">STATUS:</span> <span style="color: #10b981;">${props.status}</span>
      </p>

      <p class="meta" style="font-size: 12px; margin: 18px 0 0;">
        ${props.footer}
      </p>
    </div>
  </div>
</body>
</html>
    `;
};

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const initCron = (userData: EmailTemplateProps) => {
    cron.schedule("* * * * *", async () => {
        try {
            console.log(`Iniciando envío programado para: ${userData.toName}`);

            const dynamicHtml = getTerminalTemplate(userData);

            await transporter.sendMail({
                from: `"TodoList Premium" <${process.env.EMAIL_USER}>`,
                to: userData.toEmail,
                subject: userData.title,
                html: dynamicHtml,
            });

            console.log(`Correo enviado con éxito a ${userData.toEmail}`);
        } catch (error) {
            console.error("Error en la ejecución del cronjob:", error);
        }
    });
};