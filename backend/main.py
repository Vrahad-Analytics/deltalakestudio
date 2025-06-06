from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from pyspark.sql import SparkSession
import os

app = FastAPI()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
spark = SparkSession.builder.appName("DeltaLakeStudio").getOrCreate()

@app.post("/api/upload-csv")
async def upload_csv(file: UploadFile = File(...)):
    file_location = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_location, "wb") as f:
        f.write(await file.read())
    return {"filename": file.filename, "path": file_location}

@app.post("/api/display-dataframe")
async def display_dataframe(
    filename: str = Form(...),
    df_name: str = Form(...),
    nrows: int = Form(5)
):
    file_path = os.path.join(UPLOAD_DIR, filename)
    df = spark.read.csv(file_path, header=True, inferSchema=True)
    import pandas as pd

    pdf = df.limit(nrows).toPandas()
    # Convert all date/datetime columns to string for JSON serialization
    import datetime
    for col in pdf.columns:
        if pd.api.types.is_datetime64_any_dtype(pdf[col]) or pd.api.types.is_timedelta64_dtype(pdf[col]):
            pdf[col] = pdf[col].astype(str)
        elif pd.api.types.is_object_dtype(pdf[col]):
            # Convert Python date/datetime objects to string
            pdf[col] = pdf[col].apply(lambda x: str(x) if isinstance(x, (pd.Timestamp, pd.Timedelta, type(pd.NaT), datetime.date, datetime.datetime)) else x)
    data = pdf.to_dict(orient="records")
    columns = df.columns.tolist() if hasattr(df.columns, 'tolist') else list(df.columns)
    return JSONResponse(content={"data": data, "columns": columns})
