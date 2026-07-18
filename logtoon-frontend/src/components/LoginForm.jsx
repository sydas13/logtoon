import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ switchToRegister }) {
  const [input, setInput] = useState({ username: "", password: "" });
  const { loginAction, closeModal } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async function (e) {
    e.preventDefault();

    try {
      if (input.username == "" || input.password == "")
        throw new Error("Invalid user input", {
          cause: { source: "client", status: 400 },
        });

      const user = await loginAction(input);
      closeModal();
      navigate(`profile/${user.id}`);
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
      <h2 className="text-2xl font-bold">Login</h2>

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
          type="password"
          placeholder="Password"
          name="password"
          value={input.password}
          onChange={handleInput}
          className="w-full border p-2 mt-2"
        />

        <button
          className="w-full bg-black hover:bg-gray-900 cursor-pointer text-white p-2 mt-4"
          type="submit"
        >
          Login
        </button>
      </form>

      <p className="mt-4 text-sm">
        New here?
        <button
          onClick={switchToRegister}
          className="text-blue-500 ml-1 cursor-pointer hover:underline"
        >
          Create an account
        </button>
      </p>
    </>
  );
}
