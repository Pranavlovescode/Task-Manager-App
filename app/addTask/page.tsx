"use client";

import { useRouter } from "next/navigation"; // use this router instead of next/router
import React, { useEffect, useState } from "react";

type Task = {
  task_name: string;
  email: string;
  end_time: string;
  end_date: string;
  desc: string;
};
const AddTask: React.FC = () => {
  const router = useRouter();
  const [task_data, setTask_data] = useState<Task>({
    task_name: "",
    email: "",
    end_time: "",
    end_date: "",
    desc: "",
  });

  const handelFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8000/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task_data),
    });
    const res = await response.json();
    alert("Task Added Successfully");
    console.log(res);
    router.push("/");
  };
  useEffect(() => {
    console.log(task_data);
  }, []);

  return (
    <>
      <section className="h-screen bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-2xl px-4 py-8 lg:py-16">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Add a new Task
          </h2>
          <form onSubmit={handelFormSubmit}>
            <div className="sm:col-span-2">
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Task Name
              </label>
              <input
                type="text"
                name="task_name"
                id="task_name"
                onChange={(e) => {
                  setTask_data({ ...task_data, task_name: e.target.value });
                }}
                className="mb-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="Type Task name"
                required
              />
            </div>
            <div className="mb-4 grid gap-4 sm:grid-cols-3 sm:gap-6">
              <div className="w-full">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  onChange={(e) => {
                    setTask_data({ ...task_data, email: e.target.value });
                  }}
                  className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="Your Email"
                  required
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="End-date"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  End Date
                </label>
                <div className="flex flex-row">
                  <input
                    type="date"
                    name="end_date"
                    id="end_date"
                    onChange={(e) => {
                      setTask_data({ ...task_data, end_date: e.target.value });
                    }}
                    className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 mr-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    placeholder="YYYY-MM-DD"
                    required
                  />
                </div>
              </div>
              <div className="w-full">
                <label
                  htmlFor="End-time"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  End Time
                </label>
                <div className="flex flex-row">
                  <input
                    type="time"
                    name="end_time"
                    id="end_time"
                    onChange={(e) => {
                      setTask_data({ ...task_data, end_time: e.target.value });
                    }}
                    className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 mr-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    placeholder="YYYY-MM-DD"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Description
              </label>
              <textarea
                id="desc"
                name="desc"
                onChange={(e) => {
                  setTask_data({ ...task_data, desc: e.target.value });
                }}
                rows={8}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="Your description here"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="mt-4 inline-flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 sm:mt-6"
            >
              Add Task
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default AddTask;
