import { useState } from "react";
import { useAuth } from "./AuthContext";

export default function RegisterForm({ switchToLogin }) {
  const [input, setInput] = useState({ email: "", username: "", password: "" });

  const auth = useAuth();

  const handleSubmit = async function (e) {
    e.preventDefault();

    try {
      if (input.username == "" || input.password == "" || input.email == "")
        throw new Error("Invalid user input", {
          cause: { source: "client", status: 400 },
        });

      await auth.registerAction(input);
      switchToLogin();
    } catch (error) {
      error.cause?.source === "client" ? alert(error) : console.log(error);
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value.replace(/\s/g, "") }));
  };

  return (
    <>
      <h2 className="text-2xl font-bold">Register</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          name="username"
          value={input.username}
          onChange={handleInput}
          className="w-full border p-2 mt-4"
        />

        <input
          type="email"
          placeholder="Email"
          name="email"
          value={input.email}
          onChange={handleInput}
          className="w-full border p-2 mt-2"
        />

        <input
          type="password"
          placeholder="Password"
          name="password"
          value={input.password}
          onChange={handleInput}
          className="w-full border p-2 mt-2"
        />

        <button
          className="w-full bg-black text-white p-2 mt-4 cursor-pointer"
          type="submit"
        >
          Register
        </button>
      </form>

      <p className="mt-4 text-sm">
        Already have an account?
        <button
          onClick={switchToLogin}
          className="text-blue-500 ml-1 hover:underline cursor-pointer"
        >
          Login
        </button>
      </p>
    </>
  );
}
