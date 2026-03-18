"""
Application Entry Point
-----------------------
This is the main entry point for running the FastAPI application.
When you run this file directly (python main.py), it starts the Uvicorn server.

Uvicorn is an ASGI (Asynchronous Server Gateway Interface) server that runs FastAPI apps.
Think of it as the engine that powers your API and handles incoming HTTP requests.
"""

# Import the FastAPI application instance from app/main.py
from app.main import app

# Import application settings (configuration like host, port, debug mode)
from app.core.config import settings

# This block only runs when you execute this file directly (not when imported)
if __name__ == "__main__":
    # Import uvicorn - the server that will run our FastAPI application
    import uvicorn
    
    # Start the Uvicorn server with our FastAPI app
    uvicorn.run(
        "main:app",  # String format: "filename:app_variable_name" - tells uvicorn where to find the app
        host=settings.HOST,  # The IP address to bind to (0.0.0.0 means accessible from any network interface)
        port=settings.PORT,  # The port number to listen on (typically 8000 for development)
        reload=settings.DEBUG  # Auto-reload when code changes (only use in development, not production!)
    )
