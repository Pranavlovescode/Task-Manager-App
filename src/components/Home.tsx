import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  
  const [task, setTask] = useState<any[]>([]);
  
  const deleteTask = async (id: number) => {
    const serial = id;
    console.log(serial);
    const res = await fetch(`http://127.0.0.1:8000/delete/${serial}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    alert("Task Deleted Successfully");
    window.location.reload();
    await res.json();
  };
  
  const allTodo = async () => {
    const response = await fetch("http://127.0.0.1:8000/");
    const res = await response.json();
    // console.log(res);
    setTask(res);
  };

  useEffect(() => {
    allTodo();
    console.log(task);    
  }, []);
  return (
    <>
      <div className="relative overflow-x-auto mx-auto max-w-screen-xl shadow-md sm:rounded-lg mt-10 pt-5">
        <div className="pb-4 bg-white dark:bg-gray-900 px-3 flex flex-row justify-evenly">
          <div className="relative mt-1 flex pr-5 ">
            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="table-search"
              className="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search for items"
            />
          </div>
          <Link
            to="/addtask"
            className="flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 justify-center"
          >
            <svg
              className="h-3.5 w-3.5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                clip-rule="evenodd"
                fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              />
            </svg>
            Add Task
          </Link>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-8 py-2">
                Serial No.
              </th>
              <th scope="col" className="px-6 py-3">
                Task name
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>

              <th scope="col" className="px-6 py-3">
                Created Time
              </th>
              <th scope="col" className="px-6 py-3">
                End Time
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {task.map((tasks, id) => (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4" key={id}>
                  {id + 1}
                </td>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {tasks.title}
                </th>
                <td className="px-6 py-4">{tasks.desc}</td>
                <td className="px-6 py-4">{tasks.date_created}</td>
                <td className="px-6 py-4">{tasks.end_time}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-row">
                    <Link
                      to={`/update-task/${tasks.serial_no}`}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-3"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteTask(tasks.serial_no)}
                      className="font-medium text-red-600 dark:text-blue-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Home;
