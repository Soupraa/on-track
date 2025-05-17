import { useEffect, useState } from "react";
import styled from "styled-components";
import useTaskStore, { Task } from "../../store/useTaskStore";
import useTagStore from "../../store/useTagStore";
import Column from "../Column/Column";
import Draggable from "../Draggable/Draggable";
import Toolbar from "../Toolbar/Toolbar";
import { COLOR } from "../../common/styles";

interface DashboardProps {
    dashboardId: string;
}

const DashboardContainer = styled.div`
    display: flex;
    height: 100%;
    background: ${COLOR.MAIN_BACKGROUND};
`;

const ParagraphStyle = styled.p`
  font-size: 0.875rem;
  `

export default function Dashboard({ dashboardId }: DashboardProps) {
    const { columns, loadTasksByDashboardId } = useTaskStore();
    const { getDashboardTags, currentTags } = useTagStore();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [fromColumnId, setFromColumnId] = useState<string>("");
    const [fromIndex, setFormIndex] = useState<number | null>(null);

    useEffect(() => {
        loadTasksByDashboardId(dashboardId);
        getDashboardTags(dashboardId);
    }, [dashboardId]);

    const handleDragOver = (index: number) => {
        setHoveredIndex(index);
    };

    return (
        <DashboardContainer>
            <Toolbar tagsArr={currentTags} />
            {columns && (
                <>
                    <Column
                        columnId="todo"
                        title="To Do"
                        count={columns.todo.length}
                        hoverIndex={hoveredIndex}
                        fromColumnId={fromColumnId}
                        fromIndex={fromIndex}
                        setHoverIndex={setHoveredIndex}

                    >
                        {columns.todo.map((item: Task, index: number) => (
                            <Draggable key={item.id} item={item} onDragOver={handleDragOver} index={index} hoverIndex={hoveredIndex} currentColumnId={"todo"} setFromColumnId={setFromColumnId} setFromIndex={setFormIndex}>
                                <ParagraphStyle>{item.text}</ParagraphStyle>
                            </Draggable>
                        ))}
                    </Column>

                    <Column
                        columnId="progress"
                        title="In Progress"
                        count={columns.progress.length}
                        hoverIndex={hoveredIndex}
                        fromColumnId={fromColumnId}
                        fromIndex={fromIndex}
                        setHoverIndex={setHoveredIndex}

                    >
                        {columns.progress.map((item: Task, index: number) => (
                            <Draggable key={item.id} item={item} onDragOver={handleDragOver} index={index} hoverIndex={hoveredIndex} currentColumnId={"progress"} setFromColumnId={setFromColumnId} setFromIndex={setFormIndex}>
                                <ParagraphStyle>{item.text}</ParagraphStyle>
                            </Draggable>
                        ))}
                    </Column>

                    <Column
                        columnId="done"
                        title="Done"
                        count={columns.done.length}
                        hoverIndex={hoveredIndex}
                        fromColumnId={fromColumnId}
                        fromIndex={fromIndex}
                        setHoverIndex={setHoveredIndex}

                    >
                        {columns.done.map((item: Task, index: number) => (
                            <Draggable key={item.id} item={item} onDragOver={handleDragOver} index={index} hoverIndex={hoveredIndex} currentColumnId={"done"} setFromColumnId={setFromColumnId} setFromIndex={setFormIndex}>
                                <ParagraphStyle>{item.text}</ParagraphStyle>
                            </Draggable>
                        ))}
                    </Column>
                </>
            )}
        </DashboardContainer>
    );
}
