
import { ValidationRule } from './types';

/**
 * Generates PySpark code for data validation based on the provided rules
 * @param dataframeName The name of the dataframe to validate
 * @param rules Array of validation rules
 * @returns Generated PySpark code for validation
 */
export const generateValidationCode = (dataframeName: string, rules: ValidationRule[]): string => {
  let code = `# Data Validation for ${dataframeName}\n`;
  code += `from pyspark.sql import functions as F\n\n`;
  code += `# Original dataframe\n`;
  code += `original_df = ${dataframeName}\n\n`;
  code += `# Validation results\n`;
  code += `validation_results = []\n\n`;

  rules.forEach((rule, index) => {
    switch (rule.type) {
      case 'null':
        code += `# Check for nulls in ${rule.column}\n`;
        code += `null_count = ${dataframeName}.filter(F.col("${rule.column}").isNull()).count()\n`;
        code += `validation_results.append({"rule": "null_check", "column": "${rule.column}", "valid": null_count == 0, "failures": null_count})\n\n`;
        break;
      
      case 'dataType':
        code += `# Check data type for ${rule.column}\n`;
        code += `try:\n`;
        code += `    # Attempt to cast\n`;
        code += `    ${dataframeName}.select(F.col("${rule.column}").cast("${rule.value}")).filter(F.col("${rule.column}").isNotNull())\n`;
        code += `    validation_results.append({"rule": "data_type", "column": "${rule.column}", "valid": True, "failures": 0})\n`;
        code += `except Exception as e:\n`;
        code += `    validation_results.append({"rule": "data_type", "column": "${rule.column}", "valid": False, "failures": str(e)})\n\n`;
        break;
      
      case 'range':
        if (rule.condition && rule.value) {
          code += `# Check range for ${rule.column}\n`;
          code += `range_failures = ${dataframeName}.filter(~(F.col("${rule.column}") ${rule.condition} ${rule.value})).count()\n`;
          code += `validation_results.append({"rule": "range", "column": "${rule.column}", "valid": range_failures == 0, "failures": range_failures})\n\n`;
        }
        break;
      
      case 'regex':
        if (rule.value) {
          code += `# Check regex pattern for ${rule.column}\n`;
          code += `regex_failures = ${dataframeName}.filter(~F.regexp_extract(F.col("${rule.column}"), r'${rule.value}', 0).isNotNull()).count()\n`;
          code += `validation_results.append({"rule": "regex", "column": "${rule.column}", "valid": regex_failures == 0, "failures": regex_failures})\n\n`;
        }
        break;
      
      case 'schema':
        code += `# Schema validation\n`;
        code += `expected_schema_fields = ${JSON.stringify(rule.value)}\n`;
        code += `actual_fields = [field.name for field in ${dataframeName}.schema.fields]\n`;
        code += `missing_fields = [f for f in expected_schema_fields if f not in actual_fields]\n`;
        code += `validation_results.append({"rule": "schema", "valid": len(missing_fields) == 0, "failures": missing_fields})\n\n`;
        break;
      
      case 'custom':
        if (rule.condition) {
          code += `# Custom validation: ${rule.condition}\n`;
          code += `try:\n`;
          code += `    custom_result = ${dataframeName}.filter(${rule.condition}).count() > 0\n`;
          code += `    validation_results.append({"rule": "custom", "condition": "${rule.condition}", "valid": custom_result, "failures": 0 if custom_result else 1})\n`;
          code += `except Exception as e:\n`;
          code += `    validation_results.append({"rule": "custom", "condition": "${rule.condition}", "valid": False, "failures": str(e)})\n\n`;
        }
        break;
    }
  });

  code += `# Create a validation summary dataframe\n`;
  code += `validation_summary = spark.createDataFrame(validation_results)\n`;
  code += `display(validation_summary)\n\n`;
  code += `# Flag records that fail validation\n`;
  code += `# This creates a new column 'validation_status' with 'pass' or 'fail'\n`;
  code += `validated_df = ${dataframeName}\n\n`;
  
  // Add example of how to filter invalid records
  code += `# Example of how to flag or filter invalid records based on specific rules\n`;
  if (rules.length > 0 && rules[0].column) {
    const sampleRule = rules[0];
    code += `# Example: Flag records failing the ${sampleRule.type} check on ${sampleRule.column}\n`;
    if (sampleRule.type === 'null') {
      code += `validated_df = validated_df.withColumn("validation_status", F.when(F.col("${sampleRule.column}").isNull(), "fail").otherwise("pass"))\n\n`;
    } else if (sampleRule.type === 'range' && sampleRule.condition && sampleRule.value) {
      code += `validated_df = validated_df.withColumn("validation_status", F.when(F.col("${sampleRule.column}") ${sampleRule.condition} ${sampleRule.value}, "pass").otherwise("fail"))\n\n`;
    }
  } else {
    code += `# Add your validation flagging logic here based on your specific rules\n\n`;
  }

  code += `# Display validation results\n`;
  code += `display(validated_df)\n`;
  
  return code;
};

/**
 * Generates a simplified code summary for display in the node
 * @param rules Array of validation rules
 * @returns Simplified code summary
 */
export const generateValidationCodeSummary = (rules: ValidationRule[]): string => {
  if (rules.length === 0) {
    return "# No validation rules defined";
  }
  
  return `# Validating ${rules.length} rules:\n` + 
    rules.slice(0, 3).map(rule => 
      `# - ${rule.type} check${rule.column ? ` on "${rule.column}"` : ''}`
    ).join('\n') +
    (rules.length > 3 ? `\n# ... and ${rules.length - 3} more` : '');
};
