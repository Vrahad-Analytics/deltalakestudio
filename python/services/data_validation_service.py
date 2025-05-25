def generate_validation_code(dataframe_name, rules):
    """
    Generates PySpark code for data validation based on the provided rules
    
    Args:
        dataframe_name: The name of the dataframe to validate
        rules: Array of validation rules
        
    Returns:
        Generated PySpark code for validation
    """
    if not rules or not dataframe_name:
        return "# No validation rules provided"
        
    code = f"# Data Validation for {dataframe_name}\n"
    code += "from pyspark.sql import functions as F\n\n"
    code += f"# Original dataframe\n"
    code += f"original_df = {dataframe_name}\n\n"
    code += "# Validation results\n"
    code += "validation_results = []\n\n"
    
    for i, rule in enumerate(rules):
        rule_type = rule.get('type')
        column = rule.get('column')
        
        if not rule_type or not column:
            continue
            
        code += f"# Rule {i+1}: {rule_type} check on {column}\n"
        
        if rule_type == 'notNull':
            code += f"null_count = original_df.filter(F.col('{column}').isNull()).count()\n"
            code += f"validation_results.append({{\n"
            code += f"    'rule': 'Not Null Check',\n"
            code += f"    'column': '{column}',\n"
            code += f"    'passed': null_count == 0,\n"
            code += f"    'details': f'{{null_count}} null values found'\n"
            code += f"}})\n\n"
        elif rule_type == 'unique':
            code += f"total_count = original_df.count()\n"
            code += f"distinct_count = original_df.select('{column}').distinct().count()\n"
            code += f"validation_results.append({{\n"
            code += f"    'rule': 'Uniqueness Check',\n"
            code += f"    'column': '{column}',\n"
            code += f"    'passed': total_count == distinct_count,\n"
            code += f"    'details': f'{{total_count - distinct_count}} duplicate values found'\n"
            code += f"}})\n\n"
        elif rule_type == 'range':
            min_val = rule.get('min')
            max_val = rule.get('max')
            code += f"out_of_range = original_df.filter((F.col('{column}') < {min_val}) | (F.col('{column}') > {max_val})).count()\n"
            code += f"validation_results.append({{\n"
            code += f"    'rule': 'Range Check',\n"
            code += f"    'column': '{column}',\n"
            code += f"    'passed': out_of_range == 0,\n"
            code += f"    'details': f'{{out_of_range}} values outside range [{min_val}, {max_val}]'\n"
            code += f"}})\n\n"
    
    code += "# Create a validation summary dataframe\n"
    code += "validation_df = spark.createDataFrame(validation_results)\n"
    code += "display(validation_df)\n\n"
    code += "# Return validation status\n"
    code += "all_passed = all(result['passed'] for result in validation_results)\n"
    code += "print('Validation ' + ('passed' if all_passed else 'failed'))\n"
    
    return code

def generate_validation_code_summary(dataframe_name, rules):
    """Generate a summary of the validation code"""
    rule_count = len(rules) if rules else 0
    return f"Data validation for {dataframe_name} with {rule_count} rules"

def validate_data(dataframe, rules):
    """
    Validates a dataframe against a set of rules
    
    Args:
        dataframe: The dataframe to validate (or dataframe name if using in notebook context)
        rules: Array of validation rules
        
    Returns:
        Dictionary with validation results
    """
    # This is a placeholder function that would normally execute validation
    # In a real implementation, this would run the validation logic against a live dataframe
    # For now, we'll just return a mock result
    
    results = {
        'passed': True,
        'rules_checked': len(rules) if rules else 0,
        'rules_passed': len(rules) if rules else 0,
        'details': []
    }
    
    # In a real implementation, we would loop through the rules and check each one
    # against the dataframe
    
    return results