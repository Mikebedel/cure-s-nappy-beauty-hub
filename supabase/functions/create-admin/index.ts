import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const { email, password } = await req.json();

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data: existing } = await supabaseAdmin
    .from("user_roles")
    .select("id")
    .eq("role", "admin")
    .limit(1);

  if (existing && existing.length > 0) {
    return new Response(JSON.stringify({ error: "Un admin existe déjà." }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data: userData, error: createError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (createError) {
    return new Response(JSON.stringify({ error: createError.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { error: roleError } = await supabaseAdmin
    .from("user_roles")
    .insert({ user_id: userData.user!.id, role: "admin" });

  if (roleError) {
    return new Response(JSON.stringify({ error: roleError.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
