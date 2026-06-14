Act as an expert Senior Frontend Engineer. Your task is to complete and secure the entire E-commerce Frontend layout using React, Next.js (App Router), and Tailwind CSS. The entire application must strictly adhere to a high-contrast "Monochrome Ledger" design language (pure black, pure white, and clean grays with monospaced typography). No gradients, no colorful buttons, and no rounded corners.

CRITICAL RESTRAINT: DO NOT touch, configure, or alter any Cronjobs, background workers, or Nodemailer/email transporter logic. Focus exclusively on Frontend client logic and its immediate state bindings.

Implement the following structural specifications across the project files:

1. Authentication Layouts (src/app/login/page.tsx & src/app/register/page.tsx):
   - Refactor these views using the previously defined custom hooks `useLoginLogic` and `useRegisterLogic`.
   - Maintain a bare, ultra-clean HTML form architecture where you only style the outer containers and input borders in flat black and white. 
   - Keep the essential input attributes intact (name="email", name="password", name="name") and map the submission triggers to the hooks' handlers.

2. Single Page Dashboard (src/app/dashboard/page.tsx):
   - Ensure the layout functions entirely as an SPA. The background must permanently display the product feed grid (`ProductGrid`).
   - Implement the top horizontal sticky navbar. Left side: Brand system text. Right side: Flat action buttons with minimal icons: "📦 CATALOGUE", "🤍 FAVORITES", "▤ TRANS_LOGS", and "🛒 CART (00)".
   - Clicking these buttons must toggle floating, absolute-positioned panels directly underneath the navbar without reloading the page or clearing the background catalog:
     * CART Panel: A compact, narrow receipt-like block (width around 320px / w-80).
     * FAVORITES Panel: A spacious, wide sub-grid (max-width 2xl) displaying saved items.
     * TRANSACTION LOGS Panel: A clean, structured accounting ledger (max-width xl) displaying invoice history.

3. Interactive Product Cards (src/components/ProductGrid.tsx):
   - Refactor the card layout to be flat white with sharp black borders.
   - Every product card must include a clean heart icon/button ("🤍" or "🖤") positioned strategically (e.g., top-right corner of the image placeholder or next to the title).
   - Wire this heart button to trigger a `POST /api/favorites` call to immediately bookmark the item, changing its visual state upon success.

4. Client-Side Security & Middleware Skeletons:
   - Verify that all sensitive interactions handle the `MOCK_USER_ID` or session tokens safely.
   - If error boundaries or state delays occur during data streams (like cart updates or checkout execution), display sharp, monospaced feedback blocks (e.g., "[!!] ERROR_FETCH_TIMEOUT" or "🔄 SYNCING_LEDGER...").

Review the workspace files, apply this rigid design system to the remaining frontend modules, and confirm when the visual layout matches the asymmetric floating grid requirements perfectly.