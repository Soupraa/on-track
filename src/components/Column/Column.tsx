import React, { ReactNode, useState } from "react";
import styled from "styled-components";
import { COLOR, TYPOPGRAPHY } from "../../common/styles";

interface ColumnProps {
    id?: string;
    title: string;
    children: ReactNode;
    onDrop: (itemId: string) => void;
    count: number;
}

const ColumnWrapper = styled.div<{ $isActive: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 0.2rem 1rem;
  border-radius: 0.5rem;
  max-width: 18rem;
  min-width: 14rem;
  min-height: 65%;
  height: fit-content;
  background-color: ${({ $isActive }) => ($isActive ? "#1a1a1a" : COLOR.MAIN_BACKGROUND)};
  border: 1px solid ${({ $isActive }) => ($isActive ? "#1a1a1a" : "#272727")};
  transition: all 0.3s ease;
`;

const Title = styled.h2<{ $isActive: boolean }>`
  margin-bottom: 1rem;
  text-align: center;
  font-size: 1.875rem;
  font-family: ${TYPOPGRAPHY.SQUADA_ONE};
  letter-spacing: 0.05rem;
  font-weight: 100;
  word-break: break-word;
  overflow: hidden;
  color: ${({ $isActive }) => ($isActive ? "white" : "white")};
`;

const TaskContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function Column({ id, title, children, onDrop, count }: ColumnProps) {
    const [isActive, setIsActive] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsActive(true);
    };

    const handleDragLeave = () => {
        setIsActive(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsActive(false);
        const itemId = e.dataTransfer.getData("text/plain");
        onDrop(itemId);
    };

    return (
        <ColumnWrapper
            id={id}
            $isActive={isActive}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <Title $isActive={isActive}>
                {title}: {count}
            </Title>
            <TaskContainer>{children}</TaskContainer>
        </ColumnWrapper>
    );
}
