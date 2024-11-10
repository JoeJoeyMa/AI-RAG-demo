import React from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";

export default function MoaisPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar className="bg-transparent max-w-7xl mx-auto px-4">
        <NavbarBrand>
          <p className="font-bold text-inherit">MoaiStudio</p>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-8" justify="center">
          <NavbarItem>
            <Link color="foreground" href="#" className="text-gray-600 hover:text-gray-800">
              Moweta
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="#" color="foreground" className="text-gray-600 hover:text-gray-800">
              Loas Sooot
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="#" className="text-gray-600 hover:text-gray-800">
              Foieic at
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button as={Link} href="#" variant="light" className="bg-gray-200 text-gray-800 rounded-lg px-4 py-2">
              Osyrit
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center max-w-6xl mx-auto">
          <h1 className="text-8xl font-bold mb-16 leading-tight text-center">
            <span className="text-gray-800">M</span>
            <span className="text-orange-500">oAi</span>
            <span className="text-gray-800">Studio</span>
          </h1>
          <Button color="warning" size="lg" className="mb-16 px-12 py-6 text-white text-xl font-semibold rounded-full">
            Get Started
          </Button>
          <img src="/path/to/interface-example.png" alt="MoaiStudio Interface" className="mb-16 w-full max-w-2xl" />
          <div className="text-center max-w-2xl">
            <h2 className="text-4xl font-semibold mb-6 text-gray-800">What is Moaistudio?</h2>
            <p className="text-gray-600 text-xl leading-relaxed">
              Whe tis te yed asnststudef ris the a bssoton, fnet dee ttorte aden
              mearz ncttatoa ts ands mt tuns.tredtvts Atghtnut otentod the thee
              The itnensta oaote tto tns oamnty kmtty wtty vtentere.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}