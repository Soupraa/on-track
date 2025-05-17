import { useEffect, useRef, useState } from 'react';
import './App.css';
import DashboardNavigator from './components/DashboardNavigator/DashboardNavigator';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import gsap from 'gsap';
function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading) {
      const tl = gsap.timeline();
      tl.fromTo(
        dashboardRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
        }
      );
    }
  }, [isLoading]);
  return (
    <div className="App">
      <LoadingScreen loading={isLoading} onFinish={() => setIsLoading(false)} />
      {!isLoading && <div ref={dashboardRef}><DashboardNavigator /></div>}
    </div >
  );
}

export default App;
