import { useState } from "react";
import { AudioManager } from "./components/AudioManager";
import Transcript from "./components/Transcript";
import { useTranscriber } from "./hooks/useTranscriber";
import backgroundVideo from './waveform.mp4';

function Navbar() {
    return (
        <nav className="bg-gray/30 backdrop-blur-lg py-4 fixed top-0 left-0 right-0 z-20" style={{borderBottom: "1px solid white"}}>
            <div className="container mx-auto flex justify-center items-center">
                <div className="flex items-center">
                    <span className="text-white text-lg font-semibold mr-4">भाषाTalk</span>
                    <a href="#" className="text-gray-300 hover:text-white px-3 py-2">Home</a>
                    <a href="#" className="text-gray-300 hover:text-white px-3 py-2">Features</a>
                    <a href="#" className="text-gray-300 hover:text-white px-3 py-2">About Us</a>
                </div>
            </div>
        </nav>
    );
}

function Footer() {
  return (
    <footer className="bg-black/30 backdrop-blur-lg py-4 fixed bottom-0 left-0 right-0 z-20" style={{borderTop: "1px solid white"}}>
      <div className="container mx-auto text-center text-gray-300">
        <p>&copy; 2024 भाषाTalk. All rights reserved.</p>
      </div>
    </footer>
  );
}

function App() {
  const transcriber = useTranscriber();

  return (
    <div className="flex flex-col min-h-screen relative">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src={backgroundVideo}
        autoPlay
        loop
        muted
      />

      <Navbar />
      <div className="flex-grow flex justify-center items-center z-10 pt-20">
        <div className="container flex flex-col justify-center items-center bg-black/10 backdrop-blur-lg rounded-lg p-8 " style={{border:"1px solid white"}}>
          <h1 className=" text-white text-lg font-semibold lg-7 text-center" style={{fontSize:"45px"}}>
          भाषा~Talk
          </h1>
          <h2 className="mt-3 mb-5 px-4 text-center text-1xl font-semibold tracking-tight text-white sm:text-2xl">
            Bridging Language Divides in India
          </h2>
          <AudioManager transcriber={transcriber} />
          <Transcript transcribedData={transcriber.output} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;