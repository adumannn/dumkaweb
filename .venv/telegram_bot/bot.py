from http.server import BaseHTTPRequestHandler
from telegram import Update, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, ContextTypes, CallbackQueryHandler
import json
import asyncio

# Your website URL
WEBSITE_URL = "https://dumkaweb.vercel.app"
BOT_TOKEN = "7917008059:AAEdIRN2e4eia5TZ9VKj9B1Le810EOtxcMw"

async def handle_update(update_data):
    """Handle incoming updates."""
    application = Application.builder().token(BOT_TOKEN).build()
    
    # Convert the update data to an Update object
    update = Update.de_json(update_data, application.bot)
    
    # Handle commands
    if update.message and update.message.text:
        if update.message.text == '/start':
            keyboard = [
                [
                    InlineKeyboardButton(
                        "Open Portfolio", web_app=WebAppInfo(url=WEBSITE_URL)
                    )
                ],
                [
                    InlineKeyboardButton("Blog", callback_data="blog"),
                    InlineKeyboardButton("Projects", callback_data="projects")
                ]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            await update.message.reply_text(
                "Welcome to Duman's Portfolio Bot! 👋\n\n"
                "Choose an option below:",
                reply_markup=reply_markup
            )
            return

    # Handle callback queries
    if update.callback_query:
        query = update.callback_query
        await query.answer()

        if query.data == "blog":
            keyboard = [[
                InlineKeyboardButton(
                    "Open Blog", 
                    web_app=WebAppInfo(url=f"{WEBSITE_URL}/blog.html")
                )
            ]]
            reply_markup = InlineKeyboardMarkup(keyboard)
            await query.message.reply_text(
                "Check out my latest blog posts:", 
                reply_markup=reply_markup
            )
        
        elif query.data == "projects":
            keyboard = [[
                InlineKeyboardButton(
                    "View Projects", 
                    web_app=WebAppInfo(url="https://duman.vercel.app/experiments")
                )
            ]]
            reply_markup = InlineKeyboardMarkup(keyboard)
            await query.message.reply_text(
                "Explore my projects:", 
                reply_markup=reply_markup
            )

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        update_data = json.loads(post_data.decode('utf-8'))
        
        # Create an event loop and run the async function
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(handle_update(update_data))
        
        self.send_response(200)
        self.end_headers()
        self.wfile.write('OK'.encode('utf-8'))

    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write('Bot is running'.encode('utf-8')) 