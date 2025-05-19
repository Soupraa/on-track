import { useEffect, useRef, useState } from 'react';
import './App.css';
import DashboardNavigator from './components/DashboardNavigator/DashboardNavigator';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import gsap from 'gsap';
import useAppStore from './store/useAppStore';
import { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from './theme/themes';
import Header from './components/Header/Header';


function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const isLightMode = useAppStore((state) => state.isLightMode);

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

  useEffect(() => {
    const className = isLightMode ? 'light' : 'dark';
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(className);
  }, [isLightMode]);

  return (
    <div className="App">
      <ThemeProvider theme={isLightMode ? lightTheme : darkTheme}>
        <Header />
        <LoadingScreen loading={isLoading} onFinish={() => setIsLoading(false)} />
        {!isLoading && <div ref={dashboardRef}><DashboardNavigator /></div>}
      </ThemeProvider>
    </div >
  );
}

export default App;
