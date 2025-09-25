const { Handler } = require('@netlify/functions');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    // Parse the request body
    const data = JSON.parse(event.body);
    
    // Validate required fields
    const requiredFields = [
      'clearingAgentName',
      'clientName', 
      'itemType',
      'billNumber',
      'shippingAgency',
      'date',
      'expenses',
      'totalExpenses',
      'totalBalance'
    ];
    
    for (const field of requiredFields) {
      if (!data[field]) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            error: `Missing required field: ${field}` 
          })
        };
      }
    }
    
    // Add metadata
    const expenseData = {
      ...data,
      id: `expense_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      ip: event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown',
      userAgent: event.headers['user-agent'] || 'unknown'
    };
    
    // Here you would typically save to a database
    // For now, we'll just return success
    // In production, you might save to:
    // - Airtable
    // - Google Sheets
    // - Supabase
    // - Firebase
    // - Custom database
    
    console.log('New expense submitted:', {
      id: expenseData.id,
      clientName: expenseData.clientName,
      totalExpenses: expenseData.totalExpenses,
      submittedAt: expenseData.submittedAt
    });
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        message: 'تم حفظ المعاملة بنجاح',
        id: expenseData.id,
        data: expenseData
      })
    };
    
  } catch (error) {
    console.error('Error processing expense submission:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'حدث خطأ أثناء معالجة البيانات',
        details: error.message
      })
    };
  }
};
