#!/bin/sh
source .venv/bin/activate

# Barcha kerakli kutubxonalarni yangi joydan o'rnatish
pip install -r Fintell/backend/requirements.txt

# Flask serverini ishga tushirish
# --app parametrini ham yangi joyga moslashtiramiz
python -u -m flask --app Fintell.backend.app.main run -p $PORT --debug
