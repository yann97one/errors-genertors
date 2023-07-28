from fastapi import FastAPI,WebSocket
import random
from typing import List, Dict
from fastapi.responses import JSONResponse
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
from pydantic import BaseModel
from fastapi import HTTPException
import json


app = FastAPI()
# Liste pour stocker les connexions WebSocket actives
origins = ["*"]

class Error(BaseModel):
    type: str
    level: str
    message: str
    timestamps: str




db_connection = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="re_errors-generator"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)





@app.get("/generate_error", response_model=List[Error])
async def generate_error():
    error_messages = [
        "Erreur interne",
        "Page Non trouvée",
        "Accès non authorisé",
        "Erreur de connexion à la base ",
        "Entrée invalide",
        "Erreur d'authentification",
        "Erreur de réseau",
    ]
    error_types = ["Backend Error", "Frontend Error", "Server Error"]
    error_levels = ["Error", "Warning", "Info"]

    errors = []
    for _ in range(5):  # Génère 5 erreurs aléatoires
        error_dict = {
            "message": random.choice(error_messages),
            "type": random.choice(error_types),
            "level": random.choice(error_levels),
            "timestamps": str(datetime.now()),
        }
        error_instance = Error(**error_dict)
        errors.append(error_instance)

    return errors


@app.post("/store_errors")
async def store_errors(errors: List[Error]):
    insert_query = """
    INSERT INTO errors (type, level, message,timestamps) VALUES (%s, %s, %s, %s)
    """
    try:
           with db_connection.cursor() as cursor:
               for error in errors:
                   print(error)

                   cursor.execute(insert_query, (error.type, error.level, error.message, error.timestamps))
           db_connection.commit()

           return JSONResponse(content={"message": "Erreurs enregistrées avec succès"}, status_code=201)
    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=500, detail="Erreur lors de l'enregistrement des erreurs : " + str(e))



@app.get("/display_stored_errors", response_model=List[Error])
async def display_stored_errors() -> List[Error]:
    try:
        select_query = """
        SELECT id,type, level, message, timestamps FROM errors
        """
        with db_connection.cursor(dictionary=True) as cursor:
            cursor.execute(select_query)
            stored_errors = cursor.fetchall()

        errors = []
        for error in stored_errors:
            # Convert the datetime to string
            error["timestamps"] = str(error["timestamps"])
            error_instance = Error(**error)
            errors.append(error_instance.dict())

        return errors
    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération des erreurs : " + str(e))




# select_query = """
#         SELECT id,type, level, message, timestamps FROM errors
#         """
#         with db_connection.cursor(dictionary=True) as cursor:
#             cursor.execute(select_query)
#             stored_errors = cursor.fetchall()
#
#         errors = []
#         for error in stored_errors:
#             # Convert the datetime to string
#             error["timestamps"] = str(error["timestamps"])
#             errors.append(Error(**error))
#
#         return errors
#     except Exception as e:
#         print(str(e))
#         raise HTTPException(status_code=500, detail="Erreur lors de la récupération des erreurs : " + str(e))
async def sort_errors(sorting_option: str):
    try:
        query = f"""
            SELECT * FROM errors ORDER BY {sorting_option} ASC
        """
        with db_connection.cursor(dictionary=True) as cursor:
            cursor.execute(query)
            sorted_error = cursor.fetchall()
        return sorted_error
    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération des erreurs : " + str(e))


##### WEBSOCKET##############
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        dataToSort = await websocket.receive_text()
        try:
            received_data = json.loads(dataToSort)
            sort_option = received_data.get("value")

            if sort_option == "type":
                # Récupérer les erreurs triées par type
                errors_by_type = await sort_errors("type")
                await websocket.send_text(json.dumps(errors_by_type))
            elif sort_option == "level":
                # Récupérer les erreurs triées par niveau
                errors_by_level = await sort_errors("level")
                await websocket.send_text(json.dumps(errors_by_level))
            elif sort_option == "default":
                # Renvoyer les erreurs précédemment stockées depuis la route /display_stored_errors
                default_display = await display_stored_errors()
                await websocket.send_text(json.dumps(default_display))
            else:
                await websocket.send_text(json.dumps({"message": "Option de tri non prise en charge."}))
        except json.JSONDecodeError as json_error:
            error_message = f"Erreur JSONDecodeError: {json_error}"
            print(error_message)
            await websocket.send_text(json.dumps({"error": error_message}))
        except Exception as e:
            error_message = f"Erreur inattendue: {e}"
            print(error_message)
            await websocket.send_text(json.dumps({"error": error_message}))