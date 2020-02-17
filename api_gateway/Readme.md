# API gateway for eva-platform 

## Configurações da

Configurar arquivo config.ini

### API gatway

    PORT=8089
    
### Configure MongoDB
    MONGODB_URL=mongodb://mongodb:27017
    MONGODB_NAME=eva_platform

### Socketio Logging
    
    LOGGING=TRUE

### Volume Settings 
    
    SEED_DATA_PATH=/vol_chatbot_data/seed_data/
    SESSION_MODEL_PATH=/vol_chatbot_data/temp/trainer-sessions/
    DEPLOY_MODEL_PATH=/vol_chatbot_data/rasa/server/models/
    
### Rasa Endpoint 

    RASA_URL=http://rasa:5005/model