import type { NextPage } from 'next'
import PageLayout from '../components/page-layout'

const Home: NextPage = () => {
  return (
    <PageLayout>
      <div className="flex px-36">
        <div className="w-1/2 p-6 flex flex-col mt-56">
          <h1 className="text-5xl font-bold">Mat Master</h1>
          <p className='text-xl mt-3'>Design your dream fitness studio while we take care of the boring bits.</p>
          <div className="flex w-2/3 items-baseline">
            <input id="email" type="email" className="border-1 border-black p-2 outline-none bg-gray-200 mt-3 mr-4 flex-grow" placeholder="Email Address"/>
            <button className="p-2 px-4 border-2 border-red-400 text-xl hover:bg-red-200 rounded-md" onClick={() => {
              const email = (document.getElementById('email') as HTMLInputElement)
              if (email) {
                window.open(`https://dashboard.matmaster.app/sign-up?email=${email.value}`)
              }
            }}>Sign Up</button>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default Home
