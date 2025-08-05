// Registro
export const registerUser = async (username, email, password) => {
  try {
    const response = await fetch('http://localhost/DRAVORA_API/Register.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();
    // Devuelve siempre un objeto con success y message
    return { success: data.success, message: data.message || '' };
  } catch (error) {
    console.error("Error en el registro:", error);
    return { success: false, message: "Error en el registro" };
  }
};

// Login
export const loginUser = async (email, password) => {
  try {
    const response = await fetch('http://localhost/DRAVORA_API/Login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    // Devuelve siempre un objeto con success y message
    return { success: data.success, message: data.message || '' };
  } catch (error) {
    console.error("Error en el login:", error);
    return { success: false, message: "Error en el login" };
  }
};