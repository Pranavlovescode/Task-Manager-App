"use client";
import { useEffect, useState } from "react";
import { HiInformationCircle } from "react-icons/hi";
import { Alert } from "flowbite-react";
type TaskType = {
  title: string;
  desc: string;
  date_created: string;
  end_time: string;
};
export default function Home() {
  const [task, setTask] = useState<TaskType[] | null>([]);  
  const [search, setSearch] = useState<string>("");
  const getTask = async () => {
    const response = await fetch("http://localhost:8000/");
    const data = await response.json();
    setTask(data);
    console.log(data);
  };
  const getSearchedTask = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();     
    const response = await fetch('http://localhost:8000/search',{
      method:'POST',
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({search}).toString()
    })
    const res = await response.json();
    setTask(res);
    console.log(res);
  }
  useEffect(() => {
    getTask();
  }, []);
  return (
    <main className="px-16 pt-10 dark:bg-gray-600 bg-white h-screen">
      <div className="mx-4 relative pt-2 overflow-x-auto shadow-md sm:rounded-lg">
        <div className="bg-white pb-4 pt-4 dark:bg-gray-950">
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <form className="relative ml-4 mt-1" onChange={getSearchedTask}>
            <div className="rtl:inset-r-0 pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
              <svg
                className="h-4 w-4 text-gray-500 dark:text-gray-400"
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
              id="search"
              name="search"
              onChange={(e)=>setSearch(e.target.value)}
              className="block w-80  rounded-lg border border-gray-300 bg-gray-50 ps-10 pt-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Search for tasks"
            />
          </form>
        </div>
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Serial Number
              </th>
              <th scope="col" className="px-6 py-3">
                Task Name
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
            {task ? (
              task.map((data, index) => (
                <tr className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-900">
                  <td className="w-4 p-4">
                    <div className="flex items-center">{index + 1}</div>
                  </td>
                  <th
                    scope="row"
                    className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                  >
                    {data.title}
                  </th>
                  <td className="px-6 py-4">{data.desc}</td>
                  <td className="px-6 py-4">{data.date_created}</td>
                  <td className="px-6 py-4">{data.end_time}</td>
                  <td className="px-6 py-4">
                    <a
                      href="#"
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      Edit
                    </a>
                    <a
                      href="#"
                      className="ml-2 font-medium text-red-600 hover:underline dark:text-red-500"
                    >
                      Remove
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <Alert color="failure" icon={HiInformationCircle}>
                <span>
                  <span className="font-medium">Info alert!</span> Change a few
                  things up and try submitting again.
                </span>
              </Alert>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
