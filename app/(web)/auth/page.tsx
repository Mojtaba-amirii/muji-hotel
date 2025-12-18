"use client";

import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { AiFillGithub } from "react-icons/ai";
import { signUp } from "@/libs/sanity-client";
import { signIn, useSession } from "next-auth/react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

const defaultFormData = {
  name: "",
  email: "",
  password: "",
};

const Auth = () => {
  const [formData, setFormData] = useState(defaultFormData);

  const inputStyles =
    " border border-gray-300 sm:text-sm text-black rounded-lg w-full p-2.5 focus:outline-hidden";

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  const { data: session } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session) router.push("/");
  }, [router, session]);

  const loginHandler = async () => {
    try {
      await signIn();
      router.push("/");
    } catch (err) {
      console.error("Could not login", err);
      toast.error("Could not login, something went wrong, please try again");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const user = await signUp(formData);
      if (user) {
        toast.success("Success. Please sign in");
      }
    } catch (e) {
      console.error("Error submitting", e);
      toast.error("Something went wrong, Please try again");
    } finally {
      setFormData(defaultFormData);
    }
  };

  return (
    <section className=" container mx-auto">
      <div className=" w-80 p-6 sm:p-8 space-y-4 md:space-y-6 md:w-3/4 mx-auto">
        <div className=" flex flex-col md:flex-row items-center justify-between mb-8">
          <h1 className=" text-xl md:text-2xl font-bold leading-tight tracking-tight">
            Create an account
          </h1>
          <p>Or</p>
          <span className=" inline-flex items-center">
            <AiFillGithub
              onClick={loginHandler}
              className=" mr-3 text-4xl cursor-pointer text-black dark:text-white"
            />
            <FcGoogle
              onClick={loginHandler}
              className=" ml-3 text-4xl cursor-pointer"
            />
          </span>
        </div>

        <form className=" space-y-4 md:space-y-6" onSubmit={handleSubmit}>
          <label htmlFor="name" title="name">
            Name
            <input
              type="text"
              name="name"
              id="name"
              placeholder="John Doe"
              required
              aria-required="true"
              autoComplete="username"
              className={inputStyles}
              value={formData.name}
              onChange={handleInputChange}
            />
          </label>
          <label htmlFor="email" title="email">
            Email Address
            <input
              type="email"
              name="email"
              id="email"
              placeholder="name@company.com"
              required
              aria-required="true"
              autoComplete="email"
              className={inputStyles}
              value={formData.email}
              onChange={handleInputChange}
            />
          </label>
          <label htmlFor="password" title="password">
            Password
            <input
              type="password"
              name="password"
              id="password"
              autoComplete="current-password"
              placeholder="password"
              minLength={6}
              required
              aria-required="true"
              className={inputStyles}
              value={formData.password}
              onChange={handleInputChange}
            />
          </label>
          <button
            type="submit"
            className=" w-full bg-tertiary-dark focus:outline-hidden font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Sign Up
          </button>
        </form>
        <button
          type="button"
          className=" text-blue-700 underline"
          onClick={loginHandler}
        >
          Login
        </button>
      </div>
    </section>
  );
};
export default Auth;
