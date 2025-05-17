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
    const finalColumns = [{ id: "todo", title: "To Do" }, { id: "progress", title: "In progress" }, { id: "done", title: "Done" }];
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
            {columns && finalColumns.map((fc: any, k: number) => {
                return (
                    <Column
                        key={k}
                        columnId={fc.id}
                        title={fc.title}
                        count={columns[fc.id].length}
                        hoverIndex={hoveredIndex}
                        fromColumnId={fromColumnId}
                        fromIndex={fromIndex}
                        setHoverIndex={setHoveredIndex}
                    >
                        {columns[fc.id].map((item: Task, index: number) => (
                            <Draggable key={item.id} item={item} onDragOver={handleDragOver} index={index} hoverIndex={hoveredIndex} currentColumnId={fc.id} setFromColumnId={setFromColumnId} setFromIndex={setFormIndex}>
                                <ParagraphStyle>{item.text}</ParagraphStyle>
                            </Draggable>
                        ))}
                    </Column>
                )
            }
            )}
        </DashboardContainer>
    );
}
