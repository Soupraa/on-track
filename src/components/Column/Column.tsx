import React, { ReactNode, useState } from "react";
import styled from "styled-components";
import { COLOR, TYPOPGRAPHY } from "../../common/styles";
import useTaskStore from "../../store/useTaskStore";

interface ColumnProps {
    columnId: string;
    title: string;
    children: ReactNode;
    count: number;
    hoverIndex: any;
    fromColumnId: string;
    fromIndex: any;
    setHoverIndex: (index: number) => void;
}

const ColumnWrapper = styled.div<{ $isActive: boolean }>`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  height: 100vh;
  padding-inline: 0.5rem;
  padding-top: 0.5rem;
  flex: 1; 
  max-width: 50%; 
  min-width: 0;
  background-color: ${({ $isActive }) =>
        $isActive ? "#1a1a1a" : COLOR.MAIN_BACKGROUND};
  border-right: 1px solid ${({ $isActive }) =>
        $isActive ? "#1a1a1a" : COLOR.BORDER_COLOR};
  transition: all 0.3s ease;
`;

const Title = styled.h2<{ $isActive: boolean }>`
    margin-bottom: 2rem;
    text-align: center;
    font-size: 1.875rem;
    font-family: ${TYPOPGRAPHY.SQUADA_ONE};
    letter-spacing: 0.05rem;
    font-weight: 100;
    word-break: break-word;
    overflow: hidden;
    color: ${({ $isActive }) => ($isActive ? "white" : "white")};
    user-select: none;
    -webkit-user-select: none; 
    -moz-user-select: none;
    -ms-user-select: none;
`;

const TaskContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Toolbar = styled.div`
    display: flex;
    flex-direction: row;
    border-bottom: 0.5px solid ${COLOR.BORDER_COLOR};
`;
const ToolbarItem = styled.button`
    width: 100%;
    border: none;
    background: inherit;
    color: white;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    font-family: ${TYPOPGRAPHY.OSWALD};
    font-size: 1rem;
    letter-spacing: 0.025rem;
    &:hover {
        background: rgb(220, 234, 255);
        color: inherit;
    }
`;
export default function Column({ columnId, title, children, count, hoverIndex, fromColumnId, fromIndex, setHoverIndex }: ColumnProps) {
    const [isActive, setIsActive] = useState(false);
    const { moveTaskToIndex } = useTaskStore();

    const handleDragOverWrapper = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsActive(true);
        if ((e.target as HTMLElement).id === columnId) {
            setHoverIndex(count);
        }
    };

    const handleDragLeave = () => {
        setIsActive(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsActive(false);
        const itemId = e.dataTransfer.getData("text/plain");

        const toIndex = hoverIndex;
        moveTaskToIndex(itemId, fromColumnId, columnId, fromIndex, toIndex);
    };

    return (
        <ColumnWrapper
            id={columnId}
            $isActive={isActive}
            onDragOver={handleDragOverWrapper}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* <Toolbar>
                <ToolbarItem>Clear tasks</ToolbarItem>
            </Toolbar> */}
            <Title $isActive={isActive}>
                {title}: {count}
            </Title>
            <TaskContainer>{children}</TaskContainer>
        </ColumnWrapper>
    );
}
