// Netlify Function for Magic eSIM Account Deletion Requests
// Rate limiting store (in-memory for this implementation)
const rateLimitStore = new Map();

// Clean up expired rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 60000); // Clean up every minute

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Check rate limit (5 requests per hour per IP)
function checkRateLimit(ip) {
  const now = Date.now();
  const hourInMs = 3600000; // 1 hour in milliseconds
  
  const entry = rateLimitStore.get(ip);
  
  if (!entry || now > entry.resetTime) {
    // No entry or expired entry - allow and create new
    rateLimitStore.set(ip, { count: 1, resetTime: now + hourInMs });
    return { allowed: true };
  }
  
  if (entry.count >= 5) {
    // Rate limit exceeded
    const remainingMs = entry.resetTime - now;
    const remainingMinutes = Math.ceil(remainingMs / 60000);
    return { allowed: false, remainingMinutes };
  }
  
  // Increment count
  entry.count += 1;
  return { allowed: true };
}

// Send email via Brevo
async function sendEmailViaBrevo(email, reason, ip, userAgent) {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "noreply@sannex.ng";
  const senderName = process.env.BREVO_SENDER_NAME || "SANNEX Compliance";
  
  if (!brevoApiKey) {
    throw new Error("BREVO_API_KEY not configured");
  }
  
  const timestamp = new Date().toISOString();
  
  const emailBody = `
Magic eSIM Account Deletion Request

User Email: ${email}
Reason for Deletion: ${reason}
Timestamp (UTC): ${timestamp}
IP Address: ${ip}
User Agent: ${userAgent}
  `.trim();
  
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "api-key": brevoApiKey,
    },
    body: JSON.stringify({
      sender: {
        name: senderName,
        email: senderEmail,
      },
      to: [
        {
          email: "compliance@sannex.ng",
          name: "SANNEX Compliance Team",
        },
      ],
      subject: "Magic eSIM — Account Deletion Request",
      textContent: emailBody,
    }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Brevo API error:", errorText);
    throw new Error(`Failed to send email: ${response.status}`);
  }
}

exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }
  
  try {
    // Get IP address and user agent
    const ip = event.headers["x-forwarded-for"] || 
               event.headers["x-real-ip"] || 
               context.clientContext?.ip || 
               "unknown";
    const userAgent = event.headers["user-agent"] || "unknown";
    
    // Check rate limit
    const rateLimitCheck = checkRateLimit(ip);
    if (!rateLimitCheck.allowed) {
      return {
        statusCode: 429,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: `Rate limit exceeded. Please try again in ${rateLimitCheck.remainingMinutes} minutes.`,
        }),
      };
    }
    
    // Parse request body
    const body = JSON.parse(event.body);
    
    // Validate required fields
    if (!body.email || !body.reason) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "Email and reason are required fields.",
        }),
      };
    }
    
    // Validate email format
    if (!isValidEmail(body.email)) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "Please provide a valid email address.",
        }),
      };
    }
    
    // Validate reason length
    if (body.reason.trim().length < 10) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "Please provide a more detailed reason (at least 10 characters).",
        }),
      };
    }
    
    // Send email
    await sendEmailViaBrevo(body.email, body.reason, ip, userAgent);
    
    // Return success
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: true,
        message: "Thanks. Your account will be deactivated and your data will be deleted entirely from our database within 30 days.",
      }),
    };
  } catch (error) {
    console.error("Error processing request:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "An error occurred while processing your request. Please try again later.",
      }),
    };
  }
};
