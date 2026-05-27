from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
import paho.mqtt.client as mqtt
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PARAMS = {"host": "postgres", "database": "abcd", "user": "abcd", "password": "abcd"}

class Medicion(BaseModel):
    nodo: str
    variable: str
    valor: float

@app.on_event("startup")
def startup_db():
    try:
        conn = psycopg2.connect(**DB_PARAMS)
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS mediciones (
                id SERIAL PRIMARY KEY,
                nodo VARCHAR(50),
                variable VARCHAR(50),
                valor REAL,
                fecha TIMESTAMP
            )
        """)
        conn.commit()
        conn.close()
        print("Base de datos inicializada")
    except Exception as e:
        print("Error al conectar a DB:", e)

@app.post("/mediciones")
def guardar_medicion(data: Medicion):
    conn = psycopg2.connect(**DB_PARAMS)
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO mediciones (nodo, variable, valor, fecha) VALUES (%s, %s, %s, %s)",
        (data.nodo, data.variable, data.valor, datetime.now()),
    )
    conn.commit()
    conn.close()
    return {"status": "ok", "mensaje": "Datos guardados en PostgreSQL"}

def _publicar_led(estado: str):
    estado = estado.upper()
    if estado not in ("ON", "OFF", "TOGGLE"):
        raise HTTPException(status_code=400, detail="estado debe ser ON, OFF o TOGGLE")
    try:
        client = mqtt.Client()
        client.connect("mosquitto", 1883, 60)
        client.publish("lora/control", f"CMD;LED:{estado}")
        client.disconnect()
        return {"status": "ok", "mensaje": f"Comando MQTT enviado: LED {estado}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Acepta el estado en la URL: POST /led/ON  o  POST /led/OFF
@app.post("/led/{estado}")
def controlar_led_url(estado: str):
    return _publicar_led(estado)

# Acepta el estado en el body: POST /led  con {"estado": "ON"}
class LedCommand(BaseModel):
    estado: str

@app.post("/led")
def controlar_led_body(cmd: LedCommand):
    return _publicar_led(cmd.estado)