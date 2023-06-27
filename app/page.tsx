import { Button } from "./components/Button";
import { Textfield } from "./components/Textfield";

export default function Home() {
  return (
    <main className="h-screen w-screen">
      <div className="flex w-full h-full">
        <div className="w-2/3 flex flex-col justify-center m-14">
          <h1 className="font-black text-6xl">Estimate story point easily</h1>

          <div className="my-10">
            <Textfield label="Name"></Textfield>
            <Button text="Create room"></Button>
          </div>

        </div>
        <div className="bg-slate-700 rounded-md w-full m-5"></div>
      </div>
    </main>
  )
}
