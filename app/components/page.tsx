"use client"
import { Navbar, Button, DarkThemeToggle } from "flowbite-react";
import React from "react";

const Navbar_website: React.FC = () => {
  return (
    <>
      <Navbar fluid={true} rounded={true} className="bg-gray-100 rounded-none">
        <Navbar.Brand href="/">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="mr-3 h-6 sm:h-9"
            alt="Flowbite Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            SimpliTask
          </span>
        </Navbar.Brand>
        <div className="flex md:order-2 justify-center">
            <DarkThemeToggle/>
          <Button color={"blue"} className="ml-3">Get started</Button>
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link href="/">
            Home
          </Navbar.Link>
          <Navbar.Link href="/about">About</Navbar.Link>
          <Navbar.Link href="/navbars">Services</Navbar.Link>
          <Navbar.Link href="/navbars">Pricing</Navbar.Link>
          <Navbar.Link href="/navbars">Contact</Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default Navbar_website;
