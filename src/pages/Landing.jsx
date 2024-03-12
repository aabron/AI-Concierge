import React from 'react'
import './../index.css'

function Landing() {
  return (
    <div className='h-screen w-full bg-[url(https://cdn.asdfinc.io/media/33665/alfond-inndji_0710-1-copy.jpg?center=0.27848101265822783,0.48739495798319327&mode=crop&width=1920&height=1080&rnd=133510848810000000&quality=80)] bg-cover flex justify-center items-center'>
        <div className='flex justify-center items-center'>
            <div className='absolute h-[30%] w-[50%] mx-auto rounded-xl bg-gradient-to-b from-black to-transparent'></div>
            <div className='absolute h-[30%] w-[50%] mx-auto rounded-xl bg-gradient-to-t from-black via-transparent to-transparent'></div>
            <div className='flex justify-center items-center flex-col h-full w-[80%] text-center'>
                <h1 className='text-white font-cursive z-10 text-8xl'>Explore Winter Park</h1>
                <h2 className='text-white font-quicksand z-10 text-3xl'>Find the Attraction thats just right for you</h2>
                <button className='z-10 bg-white text-black font-quicksand text-2xl px-8 py-4 rounded-lg mt-5 hover:scale-105 hover:bg-blue-500 duration-300 ease-in-out' ><a href='/home'>Explore</a></button>
            </div>
            
        </div>
        
    </div>
  )
}

export default Landing