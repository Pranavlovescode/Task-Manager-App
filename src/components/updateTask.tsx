import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DataContext } from "../context/dataContext";

type Task = {
  title: string;
  email: string;
  end_time: string;
  desc: string;
  serial_no: number;
};

const UpdateTask: React.FC = () => {
  const data = useContext(DataContext);
  const navigate = useNavigate();
  const location = useLocation();
  const num = Number(location.pathname.split("/")[2]);
  const [initalData, setInitalData] = useState<any[]>([]);
  const [task_data, setTask_data] = useState<Task>({
    title: "",
    email: "",
    end_time: "",
    desc: "",
    serial_no: 0,
  });

  useEffect(() => {
    if (data.length > 0) {
      setInitalData(data);
      const task = data.find((task: Task) => task.serial_no === num);
      if (task) {
        setTask_data(task);
      }
    }
  }, [data, num]);

  const handelFormUpdate = async (
    e: React.FormEvent<HTMLFormElement>,
    id: number
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
    navigate("/");
  };

  return (
    <>
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
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
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4"
                placeholder="Type Task name"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 mb-4">
              <div className="w-full">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Your Email"
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="end_time"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 mr-4"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="desc"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Your description here"
              ></textarea>
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
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
