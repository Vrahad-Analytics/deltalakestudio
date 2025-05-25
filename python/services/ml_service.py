def generate_ml_training_code(dataframe_name, config):
    """
    Generates PySpark ML code for training a model
    
    Args:
        dataframe_name: Input dataframe name
        config: ML configuration with model type, target column, and feature columns
        
    Returns:
        Generated code for ML training
    """
    if not config.get('modelType') or not config.get('targetColumn') or not config.get('featureColumns'):
        return "# Insufficient configuration for ML training.\n# Please specify model type, target column, and feature columns."
    
    model_type = config.get('modelType')
    target_column = config.get('targetColumn')
    feature_columns = config.get('featureColumns', [])
    
    code = "# Machine Learning Training Pipeline\n"
    code += "from pyspark.ml import Pipeline\n"
    code += "from pyspark.ml.feature import VectorAssembler, StringIndexer, OneHotEncoder\n"
    
    # Import appropriate ML model based on the type
    if 'regression' in model_type:
        code += "from pyspark.ml.regression import LinearRegression, RandomForestRegressor, GBTRegressor\n"
        code += "from pyspark.ml.evaluation import RegressionEvaluator\n"
    else:
        code += "from pyspark.ml.classification import LogisticRegression, RandomForestClassifier, GBTClassifier\n"
        code += "from pyspark.ml.evaluation import MulticlassClassificationEvaluator, BinaryClassificationEvaluator\n"
    
    code += "\n# Input dataframe\n"
    code += f"df = {dataframe_name}\n\n"
    
    # Feature engineering
    code += "# Feature engineering pipeline stages\n"
    code += "stages = []\n\n"
    
    # Handle categorical features
    code += "# Process categorical features\n"
    code += "categorical_features = []\n"
    code += "for col in df.columns:\n"
    code += "    if df.select(col).dtypes[0][1] == 'string':\n"
    code += "        categorical_features.append(col)\n\n"
    
    code += "# Create indexers and encoders for categorical features\n"
    code += "for categorical_col in categorical_features:\n"
    code += "    # Skip the target column if it's categorical\n"
    code += f"    if categorical_col == '{target_column}' and '{target_column}' not in {feature_columns}:\n"
    code += "        continue\n"
    code += "    # Create string indexer\n"
    code += "    indexer = StringIndexer(inputCol=categorical_col, outputCol=categorical_col + '_index')\n"
    code += "    # Create one-hot encoder\n"
    code += "    encoder = OneHotEncoder(inputCol=categorical_col + '_index', outputCol=categorical_col + '_vec')\n"
    code += "    # Add to stages\n"
    code += "    stages += [indexer, encoder]\n\n"
    
    # Create vector assembler
    code += "# Create feature vector\n"
    code += "assembler_inputs = []\n"
    code += "for col in df.columns:\n"
    code += f"    if col != '{target_column}' and col in {feature_columns}:\n"
    code += "        if col in categorical_features:\n"
    code += "            assembler_inputs.append(col + '_vec')\n"
    code += "        else:\n"
    code += "            assembler_inputs.append(col)\n\n"
    
    code += "# Create vector assembler\n"
    code += "assembler = VectorAssembler(inputCols=assembler_inputs, outputCol='features')\n"
    code += "stages += [assembler]\n\n"
    
    # Handle target column if it's categorical
    if 'classification' in model_type:
        code += "# Process target column if it's categorical\n"
        code += f"if df.select('{target_column}').dtypes[0][1] == 'string':\n"
        code += f"    label_indexer = StringIndexer(inputCol='{target_column}', outputCol='label')\n"
        code += "    stages += [label_indexer]\n"
        code += "else:\n"
        code += f"    df = df.withColumn('label', df['{target_column}'])\n\n"
    else:
        code += f"# Use target column directly for regression\n"
        code += f"df = df.withColumn('label', df['{target_column}'])\n\n"
    
    # Add model to pipeline
    return code

def generate_ml_code(dataframe_name, config):
    """
    Generates PySpark ML code for a complete ML pipeline including training and evaluation
    
    Args:
        dataframe_name: Input dataframe name
        config: ML configuration with model type, target column, and feature columns
        
    Returns:
        Generated code for ML pipeline
    """
    training_code = generate_ml_training_code(dataframe_name, config)
    
    # Add evaluation code
    eval_code = """
# Evaluate the model
from pyspark.ml.evaluation import MulticlassClassificationEvaluator, RegressionEvaluator

# Split the data
train_data, test_data = df.randomSplit([0.8, 0.2], seed=42)

# Train the model
model = pipeline.fit(train_data)

# Make predictions
predictions = model.transform(test_data)

# Select example rows to display
predictions.select("features", "label", "prediction").show(5)

# Evaluate the model
"""
    
    if config.get('modelType') in ['logisticRegression', 'decisionTree', 'randomForest', 'gbt']:
        eval_code += """
evaluator = MulticlassClassificationEvaluator(
    labelCol="label", predictionCol="prediction", metricName="accuracy")
accuracy = evaluator.evaluate(predictions)
print(f"Accuracy = {accuracy}")
"""
    else:
        eval_code += """
evaluator = RegressionEvaluator(
    labelCol="label", predictionCol="prediction", metricName="rmse")
rmse = evaluator.evaluate(predictions)
print(f"Root Mean Squared Error (RMSE) = {rmse}")
"""
    
    # Save model code
    save_code = """
# Save the model
model.write().overwrite().save("/tmp/spark-model")
print("Model saved to /tmp/spark-model")
"""
    
    return training_code + eval_code + save_code

def deploy_ml_model(model_path, target_path, databricks_token, databricks_url):
    """
    Deploy a trained ML model to a target location
    
    Args:
        model_path: Path to the trained model
        target_path: Target path to deploy the model
        databricks_token: Databricks API token
        databricks_url: Databricks workspace URL
        
    Returns:
        Dictionary with deployment status and details
    """
    # This is a placeholder function that would normally handle model deployment
    # In a real implementation, this would use the Databricks API to deploy the model
    
    # For now, we'll just return a mock result
    result = {
        'status': 'success',
        'model_path': model_path,
        'target_path': target_path,
        'deployment_time': '2023-05-20T12:00:00Z',
        'details': 'Model successfully deployed'
    }
    
    return result