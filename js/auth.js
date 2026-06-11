// ============================================================
// js/auth.js — MPCS Proveedores
// ============================================================

async function signIn(email, password) {
  return await sbClient.auth.signInWithPassword({ email, password });
}

async function signOut() {
  await sbClient.auth.signOut();
  window.location.href = '/index.html';
}

async function checkSession() {
  const { data: { session } } = await sbClient.auth.getSession();
  return session;
}

async function getPerfil() {
  const session = await checkSession();
  if (!session) return null;
  const { data } = await sbClient
    .from('perfiles')
    .select('*')
    .eq('user_id', session.user.id)
    .single();
  return data;
}

async function requireAuth() {
  const session = await checkSession();
  if (!session) { window.location.href = '/index.html'; return null; }
  const perfil = await getPerfil();
  if (!perfil || perfil.estado !== 'activo' || perfil.rol !== 'proveedor') {
    await sbClient.auth.signOut();
    window.location.href = '/index.html';
    return null;
  }
  return perfil;
}

async function handleLogout() {
  await signOut();
}
