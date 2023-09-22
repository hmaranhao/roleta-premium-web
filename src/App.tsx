import { useEffect, useState } from 'react';
import { Wheel } from 'react-custom-roulette'
import { api } from './api';

function App() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [wheels, setWheels] = useState([]);  

  const handleSpinClick = () => {
    
    setMustSpin(true)
  }

  const loadWheels = () => {
    api.get('/wheels').then(response => {
      setWheels(response.data.wheels)
    })
  }


  const getPrizeWinner = (prizes: any[]) => {
    // Calcula o total de percentuais
    const totalPercentuais = prizes.reduce((total, prize) => {
      const value = total + prize.chancePercent
      
      return value
    }, 0);
  
    // Gere um número aleatório entre 0 e o total de percentuais
    const randomNumber = Math.random() * totalPercentuais;
    let limiteInferior = 0;
    for (const prize of prizes) {
      const limiteSuperior = limiteInferior + prize.chancePercent;
      if (randomNumber >= limiteInferior && randomNumber < limiteSuperior) {
        debugger
        setPrizeNumber(prizes.findIndex((p) => p.id === prize.id))
      }
      limiteInferior = limiteSuperior;
    }  
  }

  useEffect(() => {
    loadWheels()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen text-[#79ff12] bg-purple-950">
      {wheels?.map((wheel: any) => {
        const prizes = wheel?.WheelPrizes?.map((prize: any) => ({ option: prize.title, style: { backgroundColor: prize.color }, ...prize }))
        
        if(prizes.length === 0) return 'Roleta não tem premiações configuradas'
        
        return (
        <>        
          <h1 className="text-3xl font-bold ">{wheel.title}</h1>
            <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={prizes}
            backgroundColors={['#79ff12', '#5202ad']}
            textColors={['#ffffff']}
            outerBorderColor="#210046"
            innerBorderColor="#210046"
            radiusLineColor="#210046"
            onStopSpinning={() => {
              setMustSpin(false);
            }}
          />
          <button 
            onClick={() => {
              handleSpinClick()
              getPrizeWinner(prizes)
            }}
            className='px-4 py-2 mt-4 text-white bg-[#74d52a] rounded hover:bg-[#538a29]'
          >
            Rodar a Rodinha
          </button>
        </>
      )})}
      
    </div>
  )
}

export default App
