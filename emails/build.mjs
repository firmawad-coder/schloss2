import { render } from "@react-email/render";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import React from "react";
import OrderConfirmation from "./OrderConfirmation.jsx";

const html = await render(React.createElement(OrderConfirmation), { pretty: true });
const out = resolve("../backend/email_templates/order_confirmation.html");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, html, "utf8");
console.log("Wrote", out, "(", html.length, "bytes )");
