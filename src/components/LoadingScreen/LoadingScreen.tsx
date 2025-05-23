import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { TYPOPGRAPHY } from '../../common/styles';
import gsap from 'gsap';

const LoadingText = styled.p`
    color: ${({theme}) => theme.COLORS.TEXT_COLOR};
    font-family: ${TYPOPGRAPHY.OSWALD};
    letter-spacing: 0.025rem;
    font-size: 1.5rem;
`;

const Container = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;
interface ILoadingScreen {
    loading: boolean;
    onFinish: () => void;
}
const LoadingScreen: React.FC<ILoadingScreen> = ({ loading, onFinish }) => {
    const [progress, setProgress] = useState<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => Math.min(prev + Math.floor(Math.random() * 10), 100));
        }, 50);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (progress >= 100) {
            gsap.to(containerRef.current, {
                scale: 1,
                opacity: 0,
                duration: 2,
                ease: 'power3.inOut',
                onComplete: () => {
                    onFinish();
                },
            });
        }
    }, [progress, onFinish]);
    return (
        <>
            {loading &&
                <Container ref={containerRef}>
                    <LoadingText>Loading dashboards... {progress}%</LoadingText>
                </Container>
            }
        </>
    );
}
export default LoadingScreen;
