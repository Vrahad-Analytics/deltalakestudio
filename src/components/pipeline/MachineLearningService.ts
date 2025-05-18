
import { MLConfig } from './types';

/**
 * Generates PySpark ML code for training a model
 * @param dataframeName Input dataframe name
 * @param config ML configuration
 * @returns Generated code for ML training
 */
export const generateMLTrainingCode = (
  dataframeName: string,
  config: MLConfig
): string => {
  if (!config.modelType || !config.targetColumn || !config.featureColumns || config.featureColumns.length === 0) {
    return `# Insufficient configuration for ML training.\n# Please specify model type, target column, and feature columns.`;
  }
  
  let code = `# Machine Learning Training Pipeline\n`;
  code += `from pyspark.ml import Pipeline\n`;
  code += `from pyspark.ml.feature import VectorAssembler, StringIndexer, OneHotEncoder\n`;
  
  // Import appropriate ML model based on the type
  if (config.modelType.includes('regression')) {
    code += `from pyspark.ml.regression import LinearRegression, RandomForestRegressor, GBTRegressor\n`;
    code += `from pyspark.ml.evaluation import RegressionEvaluator\n`;
  } else {
    code += `from pyspark.ml.classification import LogisticRegression, RandomForestClassifier, GBTClassifier\n`;
    code += `from pyspark.ml.evaluation import MulticlassClassificationEvaluator, BinaryClassificationEvaluator\n`;
  }
  
  code += `\n# Input dataframe\n`;
  code += `df = ${dataframeName}\n\n`;
  
  // Data preparation
  code += `# Data preparation\n`;
  code += `# Handle categorical features\n`;
  code += `categorical_cols = []\n`;
  code += `numerical_cols = ${JSON.stringify(config.featureColumns)}\n\n`;
  
  code += `# Create stages for the ML pipeline\n`;
  code += `stages = []\n\n`;
  
  // Handle categorical features
  code += `# For each categorical column, we'll add a StringIndexer and OneHotEncoder\n`;
  code += `for categorical_col in categorical_cols:\n`;
  code += `    string_indexer = StringIndexer(inputCol=categorical_col, outputCol=categorical_col + "_index")\n`;
  code += `    encoder = OneHotEncoder(inputCol=categorical_col + "_index", outputCol=categorical_col + "_vec")\n`;
  code += `    stages += [string_indexer, encoder]\n\n`;
  
  // Assemble feature vector
  code += `# Combine all feature columns into a single vector column\n`;
  code += `assembler_inputs = [col for col in numerical_cols]\n`;
  code += `assembler_inputs += [col + "_vec" for col in categorical_cols]\n`;
  code += `assembler = VectorAssembler(inputCols=assembler_inputs, outputCol="features")\n`;
  code += `stages += [assembler]\n\n`;
  
  // For classification, index the label column
  if (!config.modelType.includes('regression')) {
    code += `# Convert label column to index\n`;
    code += `label_indexer = StringIndexer(inputCol="${config.targetColumn}", outputCol="label")\n`;
    code += `stages += [label_indexer]\n\n`;
  } else {
    code += `# Set the label column\n`;
    code += `df = df.withColumnRenamed("${config.targetColumn}", "label")\n\n`;
  }
  
  // Create the model
  code += `# Create the model\n`;
  switch (config.modelType) {
    case 'linear_regression':
      code += `model = LinearRegression(featuresCol="features", labelCol="label"`;
      if (config.hyperparameters) {
        if (config.hyperparameters.maxIter) code += `, maxIter=${config.hyperparameters.maxIter}`;
        if (config.hyperparameters.regParam) code += `, regParam=${config.hyperparameters.regParam}`;
        if (config.hyperparameters.elasticNetParam) code += `, elasticNetParam=${config.hyperparameters.elasticNetParam}`;
      }
      code += `)\n`;
      break;
    case 'random_forest_regression':
      code += `model = RandomForestRegressor(featuresCol="features", labelCol="label"`;
      if (config.hyperparameters) {
        if (config.hyperparameters.numTrees) code += `, numTrees=${config.hyperparameters.numTrees}`;
        if (config.hyperparameters.maxDepth) code += `, maxDepth=${config.hyperparameters.maxDepth}`;
      }
      code += `)\n`;
      break;
    case 'gbt_regression':
      code += `model = GBTRegressor(featuresCol="features", labelCol="label"`;
      if (config.hyperparameters) {
        if (config.hyperparameters.maxIter) code += `, maxIter=${config.hyperparameters.maxIter}`;
        if (config.hyperparameters.maxDepth) code += `, maxDepth=${config.hyperparameters.maxDepth}`;
      }
      code += `)\n`;
      break;
    case 'logistic_regression':
      code += `model = LogisticRegression(featuresCol="features", labelCol="label"`;
      if (config.hyperparameters) {
        if (config.hyperparameters.maxIter) code += `, maxIter=${config.hyperparameters.maxIter}`;
        if (config.hyperparameters.regParam) code += `, regParam=${config.hyperparameters.regParam}`;
      }
      code += `)\n`;
      break;
    case 'random_forest_classification':
      code += `model = RandomForestClassifier(featuresCol="features", labelCol="label"`;
      if (config.hyperparameters) {
        if (config.hyperparameters.numTrees) code += `, numTrees=${config.hyperparameters.numTrees}`;
        if (config.hyperparameters.maxDepth) code += `, maxDepth=${config.hyperparameters.maxDepth}`;
      }
      code += `)\n`;
      break;
    case 'gbt_classification':
      code += `model = GBTClassifier(featuresCol="features", labelCol="label"`;
      if (config.hyperparameters) {
        if (config.hyperparameters.maxIter) code += `, maxIter=${config.hyperparameters.maxIter}`;
        if (config.hyperparameters.maxDepth) code += `, maxDepth=${config.hyperparameters.maxDepth}`;
      }
      code += `)\n`;
      break;
    default:
      code += `# Unsupported model type: ${config.modelType}\n`;
      code += `# Defaulting to Random Forest\n`;
      code += `model = RandomForestClassifier(featuresCol="features", labelCol="label")\n`;
  }
  code += `stages += [model]\n\n`;
  
  // Create and fit pipeline
  code += `# Create the pipeline\n`;
  code += `pipeline = Pipeline(stages=stages)\n\n`;
  
  code += `# Split data into training and testing sets\n`;
  code += `train_data, test_data = df.randomSplit([0.8, 0.2], seed=42)\n\n`;
  
  code += `# Fit the pipeline to the training data\n`;
  code += `fitted_pipeline = pipeline.fit(train_data)\n\n`;
  
  code += `# Make predictions on the test data\n`;
  code += `predictions = fitted_pipeline.transform(test_data)\n\n`;
  
  // Evaluate the model
  code += `# Evaluate the model\n`;
  if (config.modelType.includes('regression')) {
    code += `evaluator = RegressionEvaluator(labelCol="label", predictionCol="prediction")\n`;
    const metrics = config.evaluationMetrics || ["rmse", "mae", "r2"];
    
    metrics.forEach(metric => {
      code += `${metric} = evaluator.setMetricName("${metric}").evaluate(predictions)\n`;
    });
    
    code += `\nprint("Model performance metrics:")\n`;
    metrics.forEach(metric => {
      code += `print("${metric.toUpperCase()}: {:.4f}".format(${metric}))\n`;
    });
  } else {
    // Classification metrics
    code += `binary_evaluator = BinaryClassificationEvaluator(labelCol="label")\n`;
    code += `multi_evaluator = MulticlassClassificationEvaluator(labelCol="label", predictionCol="prediction")\n\n`;
    
    code += `auc = binary_evaluator.evaluate(predictions)\n`;
    code += `accuracy = multi_evaluator.setMetricName("accuracy").evaluate(predictions)\n`;
    code += `f1 = multi_evaluator.setMetricName("f1").evaluate(predictions)\n`;
    code += `precision = multi_evaluator.setMetricName("weightedPrecision").evaluate(predictions)\n`;
    code += `recall = multi_evaluator.setMetricName("weightedRecall").evaluate(predictions)\n\n`;
    
    code += `print("Model performance metrics:")\n`;
    code += `print("AUC: {:.4f}".format(auc))\n`;
    code += `print("Accuracy: {:.4f}".format(accuracy))\n`;
    code += `print("F1 Score: {:.4f}".format(f1))\n`;
    code += `print("Precision: {:.4f}".format(precision))\n`;
    code += `print("Recall: {:.4f}".format(recall))\n`;
  }
  
  code += `\n# Save the model for later use\n`;
  code += `# fitted_pipeline.save("/dbfs/path/to/save/model")\n\n`;
  
  code += `# Display sample predictions\n`;
  code += `display(predictions.select("features", "label", "prediction").limit(10))\n`;
  
  return code;
};

/**
 * Generates a simplified code summary for ML training
 * @param config ML configuration
 * @returns Simplified code summary
 */
export const generateMLCodeSummary = (config: MLConfig): string => {
  if (!config.modelType || !config.targetColumn) {
    return "# ML Training not configured";
  }
  
  let modelType = "Unknown";
  switch (config.modelType) {
    case 'linear_regression':
      modelType = "Linear Regression";
      break;
    case 'random_forest_regression':
      modelType = "Random Forest Regression";
      break;
    case 'gbt_regression':
      modelType = "Gradient Boosted Trees Regression";
      break;
    case 'logistic_regression':
      modelType = "Logistic Regression";
      break;
    case 'random_forest_classification':
      modelType = "Random Forest Classification";
      break;
    case 'gbt_classification':
      modelType = "Gradient Boosted Trees Classification";
      break;
  }
  
  return `# ML Training: ${modelType}\n` +
    `# Target: ${config.targetColumn}\n` +
    `# Features: ${config.featureColumns ? 
      (config.featureColumns.length > 3 ? 
        `${config.featureColumns.slice(0, 3).join(", ")}... and ${config.featureColumns.length - 3} more` : 
        config.featureColumns.join(", ")
      ) : "None specified"}`;
};
