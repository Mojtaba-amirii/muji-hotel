// Custom sign-up client function to replace next-auth-sanity/client

interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export async function signUp(userData: SignUpData) {
  try {
    const response = await fetch("/api/sanity/signUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Sign up failed with status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error during sign up:", error);
    throw error;
  }
}
