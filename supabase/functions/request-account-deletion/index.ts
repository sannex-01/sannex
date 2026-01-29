import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Rate limiting store (in-memory for this implementation)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Clean up expired rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 60000); // Clean up every minute

interface DeleteRequestBody {
  email: string;
  reason: string;
}

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Check rate limit (5 requests per hour per IP)
function checkRateLimit(ip: string): { allowed: boolean; remainingMinutes?: number } {
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
async function sendEmailViaBrevo(
  email: string,
  reason: string,
  ip: string,
  userAgent: string
): Promise<void> {
  const brevoApiKey = Deno.env.get("BREVO_API_KEY");
  const senderEmail = Deno.env.get("BREVO_SENDER_EMAIL") || "noreply@sannex.ng";
  const senderName = Deno.env.get("BREVO_SENDER_NAME") || "SANNEX Compliance";
  
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    // Get IP address and user agent
    const ip = req.headers.get("x-forwarded-for") || 
               req.headers.get("x-real-ip") || 
               "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";
    
    // Check rate limit
    const rateLimitCheck = checkRateLimit(ip);
    if (!rateLimitCheck.allowed) {
      return new Response(
        JSON.stringify({
          error: `Rate limit exceeded. Please try again in ${rateLimitCheck.remainingMinutes} minutes.`,
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // Parse request body
    const body: DeleteRequestBody = await req.json();
    
    // Validate required fields
    if (!body.email || !body.reason) {
      return new Response(
        JSON.stringify({
          error: "Email and reason are required fields.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // Validate email format
    if (!isValidEmail(body.email)) {
      return new Response(
        JSON.stringify({
          error: "Please provide a valid email address.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // Validate reason length
    if (body.reason.trim().length < 10) {
      return new Response(
        JSON.stringify({
          error: "Please provide a more detailed reason (at least 10 characters).",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // Send email
    await sendEmailViaBrevo(body.email, body.reason, ip, userAgent);
    
    // Return success
    return new Response(
      JSON.stringify({
        success: true,
        message: "Thanks. Your account will be deactivated and your data will be deleted entirely from our database within 30 days.",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred while processing your request. Please try again later.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
