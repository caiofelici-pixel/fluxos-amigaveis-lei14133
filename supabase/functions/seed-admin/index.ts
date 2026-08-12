import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const email = "admin@licitador.local";
  const password = "admin1234";

  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existing = existingUsers?.users?.find((u) => u.email === email);

  if (existing) {
    const { error: updateError } = await supabase.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
    });
    if (updateError) {
      return new Response(JSON.stringify({ error: updateError.message }), { status: 500 });
    }
    await supabase.from("profiles").update({ blocked: false }).eq("id", existing.id);
    await supabase.from("user_roles").upsert({ user_id: existing.id, role: "admin" }, { onConflict: "user_id,role" });
    return new Response(JSON.stringify({ message: "Admin password reset" }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (createError) {
    return new Response(JSON.stringify({ error: createError.message }), { status: 500 });
  }
  await supabase.from("profiles").update({ blocked: false }).eq("id", newUser.user.id);
  const { error: roleError } = await supabase
    .from("user_roles")
    .upsert({ user_id: newUser.user.id, role: "admin" }, { onConflict: "user_id,role" });
  if (roleError) {
    return new Response(JSON.stringify({ error: roleError.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ message: "Admin created successfully" }), {
    headers: { "Content-Type": "application/json" },
  });
});
