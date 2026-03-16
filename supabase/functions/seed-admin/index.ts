import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const email = "admin@licitador.local";
  const password = "admin1";

  // Check if admin already exists
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const adminExists = existingUsers?.users?.some((u) => u.email === email);

  if (adminExists) {
    return new Response(JSON.stringify({ message: "Admin already exists" }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // Create admin user
  const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError) {
    return new Response(JSON.stringify({ error: createError.message }), { status: 500 });
  }

  // The trigger will create profile + 'user' role automatically.
  // Now add 'admin' role
  const { error: roleError } = await supabase
    .from("user_roles")
    .insert({ user_id: newUser.user.id, role: "admin" });

  if (roleError) {
    return new Response(JSON.stringify({ error: roleError.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: "Admin created successfully" }), {
    headers: { "Content-Type": "application/json" },
  });
});
