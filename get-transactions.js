exports.handler = async (event, context) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
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
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: ''
    };
  }

  try {
    // In a real application, you would fetch from your database here
    // For now, we'll return an empty array since we're using local storage
    // This function is here for future integration with external data sources
    
    const transactions = [];
    
    // Example of how you might fetch from different sources:
    
    // From Airtable:
    // const airtableData = await fetch('https://api.airtable.com/v0/YOUR_BASE_ID/YOUR_TABLE_ID', {
    //   headers: { 'Authorization': `Bearer ${process.env.AIRTABLE_TOKEN}` }
    // });
    
    // From Google Sheets:
    // const sheetsData = await fetch('https://sheets.googleapis.com/v4/spreadsheets/YOUR_SHEET_ID/values/A:Z', {
    //   headers: { 'Authorization': `Bearer ${process.env.GOOGLE_API_TOKEN}` }
    // });
    
    // From Supabase:
    // const { data } = await supabase.from('expenses').select('*');
    
    console.log('Fetched transactions:', transactions.length);
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      body: JSON.stringify({
        success: true,
        transactions: transactions,
        count: transactions.length,
        message: 'تم جلب البيانات بنجاح'
      })
    };
    
  } catch (error) {
    console.error('Error fetching transactions:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'حدث خطأ أثناء جلب البيانات',
        details: error.message
      })
    };
  }
};
