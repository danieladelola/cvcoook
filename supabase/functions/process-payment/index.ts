import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function verifyPaystackPayment(reference: string): Promise<{ verified: boolean; amount?: number }> {
  const secretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
  if (!secretKey) {
    console.error("PAYSTACK_SECRET_KEY not configured");
    return { verified: false };
  }

  try {
    const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
    });
    const data = await res.json();
    if (data.status && data.data?.status === "success") {
      return { verified: true, amount: data.data.amount / 100 }; // amount in Kobo -> Naira
    }
    console.error("Paystack verification failed:", data);
    return { verified: false };
  } catch (err) {
    console.error("Paystack verify error:", err);
    return { verified: false };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // Verify caller is authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await callerClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { plan_id, payment_reference, payment_gateway, amount, currency, transaction_id, billing_period } = body;

    if (!plan_id || !payment_reference || !payment_gateway) {
      return new Response(JSON.stringify({ error: "Missing required fields: plan_id, payment_reference, payment_gateway" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify the plan exists and is active
    const { data: plan } = await supabaseAdmin
      .from("plans")
      .select("*")
      .eq("id", plan_id)
      .eq("is_active", true)
      .maybeSingle();

    if (!plan) {
      return new Response(JSON.stringify({ error: "Invalid or inactive plan" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify payment with Paystack
    if (payment_gateway === "paystack") {
      const verification = await verifyPaystackPayment(payment_reference);
      if (!verification.verified) {
        return new Response(JSON.stringify({ error: "Payment verification failed. Please contact support if you were charged." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Check for duplicate payment reference
    const { data: existingPayment } = await supabaseAdmin
      .from("payments")
      .select("id")
      .eq("gateway_reference", payment_reference)
      .maybeSingle();

    if (existingPayment) {
      return new Response(JSON.stringify({ error: "Payment already processed" }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Record the payment
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from("payments")
      .insert({
        user_id: user.id,
        plan_id,
        amount: amount || plan.price_monthly,
        currency: currency || plan.currency,
        payment_gateway,
        gateway_reference: payment_reference,
        gateway_transaction_id: transaction_id || null,
        status: "completed",
      })
      .select()
      .single();

    if (paymentError) throw paymentError;

    // Check for existing active subscription
    const { data: existingSub } = await supabaseAdmin
      .from("user_subscriptions")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    const now = new Date();
    let periodDays = 30; // default to 1 month
    
    if (billing_period === "3month") {
      periodDays = 90;
    } else if (billing_period === "6month") {
      periodDays = 180;
    } else if (billing_period === "1year") {
      periodDays = 365;
    }
    
    const periodEnd = new Date(now.getTime() + periodDays * 24 * 60 * 60 * 1000);

    if (existingSub) {
      await supabaseAdmin
        .from("user_subscriptions")
        .update({
          plan_id,
          payment_gateway,
          current_period_start: now.toISOString(),
          current_period_end: periodEnd.toISOString(),
          status: "active",
          cancel_at_period_end: false,
        })
        .eq("id", existingSub.id);

      await supabaseAdmin
        .from("payments")
        .update({ subscription_id: existingSub.id })
        .eq("id", payment.id);
    } else {
      const { data: newSub } = await supabaseAdmin
        .from("user_subscriptions")
        .insert({
          user_id: user.id,
          plan_id,
          payment_gateway,
          status: "active",
          current_period_start: now.toISOString(),
          current_period_end: periodEnd.toISOString(),
        })
        .select()
        .single();

      if (newSub) {
        await supabaseAdmin
          .from("payments")
          .update({ subscription_id: newSub.id })
          .eq("id", payment.id);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Subscription activated successfully",
      plan_name: plan.name,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Process payment error:", error);
    return new Response(JSON.stringify({ error: "An error occurred processing your payment" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
