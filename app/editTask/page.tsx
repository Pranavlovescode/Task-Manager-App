"use client";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Task = {
  title: string;
  email: string;
  end_time: string;
  desc: string;
  serial_no: number;
  end_date: string;
};

const UpdateTask: React.FC = () => {
  const [task, setTask] = useState<Task[] | null>([]);
  const router = useRouter();
  const num = Number(router.pathname.split("/")[2]);
  const getTask = async () => {
    const response = await fetch("http://localhost:8000/");
    const data = await response.json();
    setTask(data);
    console.log(data);
  };
  // const [initalData, setInitalData] = useState<any[]>([]);
  const [task_data, setTask_data] = useState<Task>({
    title: "",
    email: "",
    end_time: "",
    desc: "",
    serial_no: 0,
    end_date: "",
  });

  useEffect(() => {
    getTask()
    if (task.length > 0) {
      // setInitalData(data);
      const task_update = task.find((task: Task) => task.serial_no === num);
      if (task_update) {
        setTask_data({
          title: task_update.title,
          email: task_update.email,
          end_time: new Date(task_update.end_time)
            .toISOString()
            .split("T")[1]
            .split(".")[0],
          desc: task_update.desc,
          serial_no: task_update.serial_no,
          end_date: new Date(task_update.end_time)
            .toISOString()
            .split("T")[0]
            .split(".")[0],
        });
      }
      console.log(task_data.end_date, task_data.end_time);
    }
  }, [task, num]);

  const handelFormUpdate = async (
    e: React.FormEvent<HTMLFormElement>,
    id: number,
  ) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:8000/update/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task_data),
    });
    const res = await response.json();
    alert("Task Updated Successfully");
    console.log(res);
    router.push("/");
  };

  return (
    <>
      <section className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-2xl px-4 py-8 lg:py-16">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Update current Task
          </h2>
          <form
            onSubmit={(e) => {
              handelFormUpdate(e, num);
            }}
          >
            <div className="sm:col-span-2">
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Task Name
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={task_data.title}
                onChange={(e) => {
                  setTask_data({ ...task_data, title: e.target.value });
                }}
                className="mb-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="Type Task name"
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
                  value={task_data.email}
                  onChange={(e) => {
                    setTask_data({ ...task_data, email: e.target.value });
                  }}
                  className="focus:ring-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="Your Email"
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="end_time"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  End Time
                </label>
                <input
                  type="date"
                  name="end_date"
                  id="end_date"
                  value={task_data.end_date}
                  onChange={(e) => {
                    setTask_data({ ...task_data, end_date: e.target.value });
                  }}
                  className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 mr-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="end_time"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  End Time
                </label>
                <input
                  type="time"
                  name="end_time"
                  id="end_time"
                  value={task_data.end_time}
                  onChange={(e) => {
                    setTask_data({ ...task_data, end_time: e.target.value });
                  }}
                  className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 mr-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="desc"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Description
              </label>
              <textarea
                id="desc"
                name="desc"
                value={task_data.desc}
                onChange={(e) => {
                  setTask_data({ ...task_data, desc: e.target.value });
                }}
                rows={8}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="Your description here"
              ></textarea>
            </div>
            <button
              type="submit"
              className="mt-4 inline-flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 sm:mt-6"
            >
              Update Task
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default UpdateTask;
