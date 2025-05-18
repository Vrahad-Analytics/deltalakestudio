
/**
 * Generates executable code for a custom code node
 * @param code The custom code snippet
 * @param language The coding language (python, sql, scala)
 * @returns Formatted code ready for execution
 */
export const generateCustomCode = (
  code: string,
  language: 'python' | 'sql' | 'scala',
  inputDataframeName: string = 'df',
  outputDataframeName: string = 'result_df'
): string => {
  let formattedCode = '';
  
  switch (language) {
    case 'python':
      formattedCode = `# Custom Python Code\n\n`;
      formattedCode += `# Input dataframe: ${inputDataframeName}\n`;
      formattedCode += `# Expected output dataframe: ${outputDataframeName}\n\n`;
      
      // Add imports that might be useful
      formattedCode += `from pyspark.sql import functions as F\n`;
      formattedCode += `from pyspark.sql import types as T\n\n`;
      
      // Add the custom code
      formattedCode += `# User code begins here\n`;
      formattedCode += code + '\n\n';
      
      // Add display of result
      formattedCode += `# Display the result\n`;
      formattedCode += `display(${outputDataframeName})\n`;
      break;
      
    case 'sql':
      formattedCode = `-- Custom SQL Code\n\n`;
      formattedCode += `-- Register input dataframe as temp view\n`;
      formattedCode += `${inputDataframeName}.createOrReplaceTempView("input_data")\n\n`;
      
      // Add the custom SQL code
      formattedCode += `-- User SQL begins here\n`;
      formattedCode += `${outputDataframeName} = spark.sql("""\n`;
      formattedCode += code + '\n';
      formattedCode += `""")\n\n`;
      
      // Add display of result
      formattedCode += `-- Display the result\n`;
      formattedCode += `display(${outputDataframeName})\n`;
      break;
      
    case 'scala':
      formattedCode = `// Custom Scala Code\n\n`;
      formattedCode += `// Input dataframe: ${inputDataframeName}\n`;
      formattedCode += `// Expected output dataframe: ${outputDataframeName}\n\n`;
      
      // Add imports that might be useful
      formattedCode += `import org.apache.spark.sql.functions._\n`;
      formattedCode += `import org.apache.spark.sql.types._\n\n`;
      
      // Add the custom code
      formattedCode += `// User code begins here\n`;
      formattedCode += code + '\n\n';
      
      // Add display of result
      formattedCode += `// Display the result\n`;
      formattedCode += `display(${outputDataframeName})\n`;
      break;
  }
  
  return formattedCode;
};

/**
 * Generates a simplified code summary for display in the node
 * @param code The custom code snippet
 * @param language The coding language
 * @returns Simplified code summary
 */
export const generateCustomCodeSummary = (
  code: string,
  language: 'python' | 'sql' | 'scala'
): string => {
  // Extract the first few lines of code for summary
  const lines = code.split('\n').filter(line => line.trim() !== '');
  const previewLines = lines.slice(0, 3);
  
  let summary = `# Custom ${language.charAt(0).toUpperCase() + language.slice(1)} Code:\n`;
  
  if (previewLines.length > 0) {
    summary += previewLines.map(line => `# ${line}`).join('\n');
    if (lines.length > 3) {
      summary += `\n# ... and ${lines.length - 3} more lines`;
    }
  } else {
    summary += '# No code provided yet';
  }
  
  return summary;
};
