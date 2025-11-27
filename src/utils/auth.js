const BASE = '/dravora-api'; // proxyará el dev server a http://localhost

async function parseResponse(res) {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

async function requestJson(url, opts) {
  const res = await fetch(url, opts);
  const body = await parseResponse(res);
  return { res, body };
}

export const registerUser = async (username, email, password) => {
  try {
    const { res, body } = await requestJson(`${BASE}/register.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    if (!res.ok) return { success: false, message: typeof body === 'string' ? body : JSON.stringify(body) };
    return { success: body.success ?? true, message: body.message ?? '' };
  } catch (error) {
    console.error("Error en el registro:", error);
    return { success: false, message: "Error en el registro" };
  }
};

export const loginUser = async (email, password) => {
  try {
    const { res, body } = await requestJson(`${BASE}/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) return { success: false, message: typeof body === 'string' ? body : JSON.stringify(body) };
    return { success: body.success ?? true, message: body.message ?? '', data: body };
  } catch (error) {
    console.error("Error en el login:", error);
    return { success: false, message: "Error en el login" };
  }
};